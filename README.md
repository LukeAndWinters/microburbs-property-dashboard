# 🏘️ Microburbs Property Insight Dashboard

A modern web application that integrates with the Microburbs API to help users discover property investment opportunities through data-driven insights. Built for the Microburbs Technical Challenge - Task 3.

[![GitHub](https://img.shields.io/badge/github-LukeAndWinters%2Fmicroburbs--property--dashboard-blue)](https://github.com/LukeAndWinters/microburbs-property-dashboard)
[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-3.0-green)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🌐 Live Demo

**GitHub Repository:** https://github.com/LukeAndWinters/microburbs-property-dashboard

**Deploy Your Own:** See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions

## 📋 Overview

This dashboard allows users to search for properties by suburb and calculates an **Opportunity Score** based on suburb quality metrics and population growth data. The application provides a clean, intuitive interface that transforms complex property data into actionable insights.

## ✨ Features

- **Suburb Search**: Search for properties by suburb name
- **Property Listings**: Display detailed property information including:
  - Address and location
  - Price, bedrooms, and bathrooms
  - Property type
- **Suburb Metrics**: View key indicators:
  - Suburb Score (overall quality rating)
  - Walkability Score
  - Population Growth Rate
- **Opportunity Score**: Calculated investment opportunity rating for each property
- **Modern UI**: Clean, responsive design with card-based layout
- **Real-time Data**: Live integration with Microburbs API

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Python Flask
- **API Integration**: Requests library for HTTP calls to Microburbs API
- **Routes**:
  - `GET /`: Serves the main dashboard page
  - `GET /search?q=<suburb>`: Fetches properties for specified suburb
- **Error Handling**: Comprehensive error handling for API failures and timeouts

### Frontend (Vanilla JavaScript)
- **HTML5**: Semantic markup with modern structure
- **CSS3**: Custom styling with CSS variables and responsive design
- **JavaScript**: Vanilla JS for API calls and dynamic content rendering
- **No frameworks**: Pure JavaScript for maximum simplicity and performance

## 📊 Opportunity Score Calculation

The Opportunity Score is a weighted metric that combines suburb quality with growth potential:

```
Opportunity Score = (0.6 × Suburb Score) + (0.4 × Population Growth × 20)
```

### Formula Breakdown:
- **60% weight** on Suburb Score: Reflects current quality and amenities
- **40% weight** on Population Growth: Indicates future potential
- **Growth normalization**: Population growth % is multiplied by 20 to scale to 0-100

### Score Interpretation:
- **80-100**: Excellent opportunity
- **70-79**: Very good opportunity
- **60-69**: Good opportunity
- **50-59**: Fair opportunity
- **<50**: Limited opportunity

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or navigate to the project directory**:
```bash
cd microburbs-dashboard
```

2. **Create a virtual environment** (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure API Token** (optional):

Create a `.env` file in the project root:
```bash
MICROBURBS_API_TOKEN=your_api_token_here
```

*Note: The application defaults to 'test' token for sandbox API access*

### Running the Application

1. **Start the Flask server**:
```bash
cd app
python app.py
```

2. **Open your browser** and navigate to:
```
http://localhost:5000
```

3. **Search for properties**: Enter a suburb name (e.g., "Redfern", "Bondi") and click Search

## 📁 Project Structure

```
microburbs-dashboard/
│
├── app/
│   ├── __init__.py           # App initialization
│   ├── app.py                # Flask application and API routes
│   │
│   ├── templates/
│   │   └── index.html        # Main dashboard HTML template
│   │
│   └── static/
│       ├── script.js         # Frontend JavaScript logic
│       └── styles.css        # CSS styling and responsive design
│
├── requirements.txt          # Python dependencies
├── README.md                # Project documentation
└── .env                     # Environment variables (create this)
```

## 🔌 API Integration

### Endpoint Used
```
GET https://www.microburbs.com.au/report_generator/api/sandbox/suburb/properties
```

### Request Format
- **Method**: GET
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
- **Query Parameters**:
  - `suburb`: Name of the suburb to search

### Response Handling
The application handles various response formats and includes:
- Error handling for network failures
- Timeout handling (10-second timeout)
- Graceful degradation for missing data fields
- User-friendly error messages

### Mock Data
For demonstration purposes, suburb-level metrics (suburb_score, walkability, population_growth) are currently generated using a deterministic algorithm based on suburb name. In a production environment, these would be fetched from dedicated Microburbs API endpoints.

## 🎨 Design Decisions

### User Experience
- **Simplicity**: Clean, uncluttered interface focused on essential information
- **Visual Hierarchy**: Color-coded opportunity scores for quick assessment
- **Responsive Design**: Mobile-first approach ensures usability across devices
- **Loading States**: Clear feedback during API calls
- **Error Handling**: Informative error messages guide user actions

### Technical Choices
- **Vanilla JavaScript**: No framework dependencies for simplicity and learning purposes
- **CSS Variables**: Easy theming and consistent design tokens
- **Flask**: Lightweight Python framework perfect for small APIs
- **Modular Structure**: Separation of concerns (templates, static files, business logic)

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# API Configuration
MICROBURBS_API_TOKEN=your_actual_token_here

# Flask Configuration (optional)
FLASK_ENV=development
FLASK_DEBUG=True
```

### Customization
- **Opportunity Score Weights**: Modify the formula in `static/script.js` (line ~141)
- **Color Scheme**: Update CSS variables in `static/styles.css` (lines 9-30)
- **API Timeout**: Adjust timeout value in `app/app.py` (line 41)

## 🚧 Future Improvements

### Features
- [ ] Property filtering (price range, bedrooms, property type)
- [ ] Sorting options (price, score, date listed)
- [ ] Map view with property locations
- [ ] Favorite/bookmark properties
- [ ] Comparison tool for multiple properties
- [ ] Historical trend charts for suburbs
- [ ] Email alerts for new listings

### Technical Enhancements
- [ ] Caching layer for API responses (Redis)
- [ ] Database for storing user preferences
- [ ] User authentication and profiles
- [ ] Pagination for large result sets
- [ ] Real-time updates using WebSockets
- [ ] Export functionality (PDF, CSV)
- [ ] Advanced analytics and insights
- [ ] Integration with additional data sources

### Performance
- [ ] Image lazy loading
- [ ] API response caching
- [ ] Frontend build process (minification, bundling)
- [ ] CDN for static assets
- [ ] Progressive Web App (PWA) capabilities

### Testing
- [ ] Unit tests for backend API
- [ ] Integration tests for API calls
- [ ] Frontend JavaScript tests
- [ ] End-to-end testing with Selenium
- [ ] Load testing for API endpoints

## 🛠️ Development

### Running in Development Mode
```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python app/app.py
```

### Code Style
- Python: Follow PEP 8 guidelines
- JavaScript: ES6+ features, clear variable names
- CSS: BEM-inspired naming where applicable

## 📝 API Rate Limiting

Be mindful of API rate limits when using the Microburbs API. The sandbox environment may have restrictions on:
- Requests per minute
- Requests per day
- Concurrent connections

Consider implementing request throttling for production use.

## 🐛 Troubleshooting

### Common Issues

**Issue**: Flask app won't start
- **Solution**: Ensure you're in the correct directory (`app/`) and virtual environment is activated

**Issue**: API returns errors
- **Solution**: Check your API token in `.env` file and network connectivity

**Issue**: No properties displayed
- **Solution**: The suburb might not have listings or the API might be returning a different response format

**Issue**: Styles not loading
- **Solution**: Clear browser cache and ensure Flask is serving static files correctly

## 📄 License

This project is created for the Microburbs Technical Challenge (Task 3).

## 👤 Author

Built as a demonstration of API integration, data visualization, and modern web development practices.

## 🙏 Acknowledgments

- Microburbs API for providing the property data
- Flask documentation and community
- Modern web design principles and best practices

---

**Note**: This is a demonstration project built for a technical challenge. Suburb metrics (suburb_score, walkability, population_growth) are currently mocked for demonstration purposes. In a production environment, these would be fetched from actual Microburbs API endpoints.

