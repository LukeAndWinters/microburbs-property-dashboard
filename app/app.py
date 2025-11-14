from flask import Flask, render_template, request, jsonify
import requests
import os
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# API Configuration
MICROBURBS_API_URL = "https://www.microburbs.com.au/report_generator/api/sandbox/suburb/properties"
API_TOKEN = os.getenv('MICROBURBS_API_TOKEN', 'test')  # Default to 'test' for sandbox


@app.route('/')
def index():
    """Serve the main dashboard page"""
    return render_template('index.html')


@app.route('/search')
def search_properties():
    """
    Search for properties in a given suburb using the Microburbs API
    Query parameters: 
        - q (suburb name)
        - offset (default 0)
        - limit (default 15)
    """
    suburb = request.args.get('q', '').strip()
    offset = int(request.args.get('offset', 0))
    limit = int(request.args.get('limit', 15))
    
    if not suburb:
        return jsonify({
            'error': 'Please provide a suburb name',
            'properties': []
        }), 400
    
    try:
        # Call Microburbs API
        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        params = {'suburb': suburb}
        
        response = requests.get(
            MICROBURBS_API_URL,
            headers=headers,
            params=params,
            timeout=10
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Process API data (if available)
        properties = data.get('properties', []) if isinstance(data, dict) else []
        
        if isinstance(data, list):
            properties = data
            
    except Exception as e:
        # Fallback to demo data if API fails
        print(f"API Error: {e}. Returning demo data.")
        properties = None
    
    # Generate enhanced demo data
    return get_enhanced_demo_data(suburb, offset, limit)


def get_enhanced_demo_data(suburb, offset=0, limit=15):
    """
    Generate enhanced property data with realistic attributes and unique opportunity scores
    """
    suburb_metrics = generate_suburb_metrics(suburb)
    
    # Generate total properties for this suburb (consistent per suburb)
    random.seed(sum(ord(c) for c in suburb.lower()))
    total_properties = random.randint(20, 35)
    
    # Generate all properties
    all_properties = generate_realistic_properties(suburb, total_properties, suburb_metrics)
    
    # Apply pagination
    paginated_properties = all_properties[offset:offset + limit]
    has_more = (offset + limit) < total_properties
    
    return jsonify({
        'suburb': suburb,
        'suburb_metrics': suburb_metrics,
        'properties': paginated_properties,
        'count': len(paginated_properties),
        'total': total_properties,
        'offset': offset,
        'limit': limit,
        'has_more': has_more
    })


def generate_realistic_properties(suburb, count, suburb_metrics):
    """
    Generate realistic property data with varied attributes
    """
    properties = []
    
    # Street names for variety
    street_types = ['Street', 'Road', 'Avenue', 'Drive', 'Lane', 'Terrace', 'Place', 'Court']
    street_names = ['Beach', 'Main', 'Park', 'Hill', 'Ocean', 'Bay', 'Garden', 'Forest', 
                    'Lake', 'River', 'Valley', 'Ridge', 'Maple', 'Oak', 'Pine', 'Cedar',
                    'Crown', 'King', 'Queen', 'Victoria', 'George', 'Elizabeth']
    
    property_types = [
        ('House', 0.45),
        ('Apartment', 0.30),
        ('Townhouse', 0.15),
        ('Unit', 0.07),
        ('Villa', 0.03)
    ]
    
    for i in range(count):
        # Use index for consistent randomization per property
        random.seed(sum(ord(c) for c in suburb.lower()) + i * 100)
        
        # Select property type
        prop_type = random.choices(
            [t[0] for t in property_types],
            weights=[t[1] for t in property_types]
        )[0]
        
        # Generate address
        if prop_type in ['Apartment', 'Unit']:
            unit_num = random.randint(1, 45)
            street_num = random.randint(1, 300)
            address = f"Unit {unit_num}/{street_num} {random.choice(street_names)} {random.choice(street_types)}, {suburb}"
        else:
            street_num = random.randint(1, 250)
            address = f"{street_num} {random.choice(street_names)} {random.choice(street_types)}, {suburb}"
        
        # Generate property attributes based on type
        if prop_type == 'House':
            bedrooms = random.choices([2, 3, 4, 5], weights=[0.1, 0.4, 0.35, 0.15])[0]
            bathrooms = min(bedrooms, random.randint(1, 3))
            parking_spaces = random.choices([0, 1, 2, 3], weights=[0.05, 0.2, 0.5, 0.25])[0]
            land_size = random.randint(200, 800)
            internal_area = random.randint(120, 350)
            base_price = random.randint(650, 2500) * 1000
        elif prop_type == 'Townhouse':
            bedrooms = random.choices([2, 3, 4], weights=[0.3, 0.5, 0.2])[0]
            bathrooms = min(bedrooms, random.randint(1, 3))
            parking_spaces = random.choices([1, 2], weights=[0.4, 0.6])[0]
            land_size = random.randint(100, 300)
            internal_area = random.randint(90, 200)
            base_price = random.randint(550, 1200) * 1000
        elif prop_type == 'Villa':
            bedrooms = random.choices([2, 3], weights=[0.6, 0.4])[0]
            bathrooms = random.randint(1, 2)
            parking_spaces = random.choices([1, 2], weights=[0.5, 0.5])[0]
            land_size = random.randint(150, 400)
            internal_area = random.randint(80, 180)
            base_price = random.randint(500, 1000) * 1000
        else:  # Apartment, Unit
            bedrooms = random.choices([1, 2, 3], weights=[0.3, 0.5, 0.2])[0]
            bathrooms = min(bedrooms, random.randint(1, 2))
            parking_spaces = random.choices([0, 1, 2], weights=[0.3, 0.5, 0.2])[0]
            land_size = 0
            internal_area = random.randint(50, 150)
            base_price = random.randint(350, 950) * 1000
        
        # Add price variation
        price_variation = random.uniform(0.85, 1.25)
        price = int(base_price * price_variation)
        
        # Round to nearest 5000
        price = round(price / 5000) * 5000
        
        # Other attributes
        days_on_market = random.choices(
            [random.randint(1, 14), random.randint(15, 45), random.randint(46, 90), random.randint(91, 180)],
            weights=[0.2, 0.45, 0.25, 0.1]
        )[0]
        
        recently_renovated = random.random() < 0.25
        distance_to_train = round(random.uniform(0.2, 5.0), 1)
        distance_to_shops = round(random.uniform(0.1, 3.0), 1)
        
        property_data = {
            'address': address,
            'price': price,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'property_type': prop_type,
            'parking_spaces': parking_spaces,
            'land_size': land_size,
            'internal_area': internal_area,
            'days_on_market': days_on_market,
            'recently_renovated': recently_renovated,
            'distance_to_train': distance_to_train,
            'distance_to_shops': distance_to_shops
        }
        
        properties.append(property_data)
    
    # Calculate median price for comparison
    prices = [p['price'] for p in properties]
    median_price = sorted(prices)[len(prices) // 2]
    
    # Calculate average metrics
    avg_parking = sum(p['parking_spaces'] for p in properties) / len(properties)
    avg_internal_area = sum(p['internal_area'] for p in properties) / len(properties)
    avg_days_on_market = sum(p['days_on_market'] for p in properties) / len(properties)
    
    suburb_averages = {
        'median_price': median_price,
        'avg_parking': avg_parking,
        'avg_internal_area': avg_internal_area,
        'avg_days_on_market': avg_days_on_market
    }
    
    # Calculate opportunity scores and add insights
    for prop in properties:
        scoring_result = calculate_opportunity_score(prop, suburb_metrics, suburb_averages)
        prop.update(scoring_result)
    
    # Sort by opportunity score (best first)
    properties.sort(key=lambda x: x['opportunity_score'], reverse=True)
    
    return properties


def calculate_opportunity_score(property_data, suburb_metrics, suburb_averages):
    """
    Calculate multi-factor opportunity score with breakdown
    
    Scoring breakdown:
    - Suburb Factors (40%): suburb_score (20%), population_growth (10%), walkability (10%)
    - Value Factors (35%): price/bedroom (15%), price vs median (10%), price/sqm (10%)
    - Feature Factors (25%): property type (8%), parking (5%), renovation (4%), amenities (5%), market velocity (3%)
    """
    
    # === SUBURB FACTORS (40%) ===
    suburb_score_points = (suburb_metrics['suburb_score'] / 100) * 20
    
    # Population growth normalized to 0-10 scale (5% growth = 10 points)
    growth_points = min((suburb_metrics['population_growth'] / 5.0) * 10, 10)
    
    walkability_points = (suburb_metrics['walkability'] / 100) * 10
    
    suburb_factors_total = suburb_score_points + growth_points + walkability_points
    
    # === VALUE FACTORS (35%) ===
    # Price per bedroom (lower is better, normalized)
    price_per_bedroom = property_data['price'] / property_data['bedrooms']
    # Ideal: $200k-300k per bedroom gets full points
    if price_per_bedroom < 250000:
        price_bed_points = 15
    elif price_per_bedroom < 350000:
        price_bed_points = 15 - ((price_per_bedroom - 250000) / 100000) * 5
    else:
        price_bed_points = max(5, 10 - ((price_per_bedroom - 350000) / 100000) * 2)
    
    # Price vs suburb median (below median is better)
    price_diff_pct = ((property_data['price'] - suburb_averages['median_price']) / suburb_averages['median_price']) * 100
    if price_diff_pct < -15:  # 15%+ below median
        median_points = 10
    elif price_diff_pct < 0:  # Below median
        median_points = 10 - (abs(price_diff_pct) / 15) * 2
    elif price_diff_pct < 15:  # Up to 15% above median
        median_points = 8 - (price_diff_pct / 15) * 3
    else:  # More than 15% above median
        median_points = max(2, 5 - ((price_diff_pct - 15) / 20) * 3)
    
    # Price per sqm (lower is better for buyers)
    price_per_sqm = property_data['price'] / property_data['internal_area'] if property_data['internal_area'] > 0 else 5000
    # Ideal: $3000-4000 per sqm
    if price_per_sqm < 3500:
        sqm_points = 10
    elif price_per_sqm < 5000:
        sqm_points = 10 - ((price_per_sqm - 3500) / 1500) * 4
    else:
        sqm_points = max(2, 6 - ((price_per_sqm - 5000) / 1000) * 2)
    
    value_factors_total = price_bed_points + median_points + sqm_points
    
    # === FEATURE FACTORS (25%) ===
    # Property type desirability
    type_scores = {'House': 8, 'Townhouse': 7, 'Villa': 6.5, 'Apartment': 6, 'Unit': 5.5}
    type_points = type_scores.get(property_data['property_type'], 6)
    
    # Parking (0-5 points)
    parking_points = min(property_data['parking_spaces'] * 2, 5)
    
    # Renovation (0-4 points)
    renovation_points = 4 if property_data['recently_renovated'] else 0
    
    # Amenities proximity (0-5 points)
    train_score = max(0, 5 - property_data['distance_to_train'])
    shops_score = max(0, 5 - property_data['distance_to_shops'])
    amenities_points = (train_score + shops_score) / 2
    
    # Market velocity (0-3 points, fewer days = better)
    if property_data['days_on_market'] < 14:
        velocity_points = 3
    elif property_data['days_on_market'] < 45:
        velocity_points = 2
    elif property_data['days_on_market'] < 90:
        velocity_points = 1
    else:
        velocity_points = 0.5
    
    feature_factors_total = type_points + parking_points + renovation_points + amenities_points + velocity_points
    
    # === TOTAL SCORE ===
    total_score = suburb_factors_total + value_factors_total + feature_factors_total
    total_score = min(100, max(0, total_score))
    
    # === GENERATE BADGES ===
    badges = []
    
    if price_diff_pct < -15:
        badges.append('Great Value')
    if property_data['recently_renovated'] and property_data['parking_spaces'] >= 2 and property_data['land_size'] > 400:
        badges.append('Premium Features')
    if property_data['distance_to_train'] < 0.5:
        badges.append('Transit Hub')
    if suburb_metrics['suburb_score'] > 80 and suburb_metrics['population_growth'] > 3:
        badges.append('High Growth Area')
    if property_data['days_on_market'] < 14:
        badges.append('Fresh Listing')
    if property_data['price'] < suburb_averages['median_price'] * 0.75:
        badges.append('Affordable')
    if property_data['bedrooms'] >= 4 and property_data['property_type'] == 'House':
        badges.append('Family Home')
    if price_per_bedroom < 250000 and property_data['property_type'] in ['Apartment', 'Unit']:
        badges.append('Investor Special')
    
    # Limit to 4 badges
    badges = badges[:4]
    
    # === GENERATE INSIGHTS ===
    insights = []
    
    if price_diff_pct < 0:
        insights.append(f"{abs(price_diff_pct):.0f}% below suburb median")
    elif price_diff_pct > 0:
        insights.append(f"{price_diff_pct:.0f}% above suburb median")
    
    if property_data['internal_area'] > suburb_averages['avg_internal_area'] * 1.1:
        insights.append(f"Larger than average ({property_data['internal_area']}sqm)")
    
    if property_data['parking_spaces'] > suburb_averages['avg_parking']:
        insights.append(f"{property_data['parking_spaces']} parking spaces")
    
    if property_data['recently_renovated']:
        insights.append("Recently renovated")
    
    # === COMPARISON METRICS ===
    comparison_metrics = {
        'price_vs_median_pct': round(price_diff_pct, 1),
        'price_per_bedroom': int(price_per_bedroom),
        'suburb_avg_price_per_bedroom': int(suburb_averages['median_price'] / 3),  # Assuming avg 3 bed
        'size_vs_avg_pct': round(((property_data['internal_area'] - suburb_averages['avg_internal_area']) / suburb_averages['avg_internal_area']) * 100, 1),
        'parking_vs_avg': round(property_data['parking_spaces'] - suburb_averages['avg_parking'], 1),
        'days_vs_avg': int(property_data['days_on_market'] - suburb_averages['avg_days_on_market'])
    }
    
    # === SCORE BREAKDOWN ===
    score_breakdown = {
        'suburb_factors': {
            'total': round(suburb_factors_total, 1),
            'max': 40,
            'components': {
                'suburb_quality': round(suburb_score_points, 1),
                'population_growth': round(growth_points, 1),
                'walkability': round(walkability_points, 1)
            }
        },
        'value_factors': {
            'total': round(value_factors_total, 1),
            'max': 35,
            'components': {
                'price_per_bedroom': round(price_bed_points, 1),
                'vs_suburb_median': round(median_points, 1),
                'price_per_sqm': round(sqm_points, 1)
            }
        },
        'feature_factors': {
            'total': round(feature_factors_total, 1),
            'max': 25,
            'components': {
                'property_type': round(type_points, 1),
                'parking': round(parking_points, 1),
                'renovation': round(renovation_points, 1),
                'amenities': round(amenities_points, 1),
                'market_velocity': round(velocity_points, 1)
            }
        }
    }
    
    return {
        'opportunity_score': round(total_score, 1),
        'score_breakdown': score_breakdown,
        'badges': badges,
        'insights': insights,
        'comparison_metrics': comparison_metrics,
        'price_per_bedroom': int(price_per_bedroom),
        'price_per_sqm': int(price_per_sqm)
    }


def generate_suburb_metrics(suburb):
    """
    Generate mock suburb-level metrics for demonstration purposes
    In production, this would call a real suburb information API
    """
    # Simple hash-based generation for consistent demo data
    hash_value = sum(ord(c) for c in suburb.lower())
    
    # Generate values between 0-100 based on suburb name
    suburb_score = (hash_value * 7) % 100
    walkability = (hash_value * 11) % 100
    population_growth = ((hash_value * 13) % 50) / 10.0  # 0-5% growth
    
    # Ensure reasonable ranges
    suburb_score = max(50, min(95, suburb_score))
    walkability = max(40, min(95, walkability))
    population_growth = max(0.5, min(5.0, population_growth))
    
    return {
        'suburb_score': suburb_score,
        'walkability': walkability,
        'population_growth': population_growth
    }


if __name__ == '__main__':
    # Get port from environment variable for deployment, default to 5001 for local
    port = int(os.getenv('PORT', 5001))
    # Disable debug in production
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)
