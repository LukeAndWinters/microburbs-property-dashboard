# 🚀 Deployment Guide - Microburbs Property Dashboard

## ✅ GitHub Repository

**Repository:** https://github.com/LukeAndWinters/microburbs-property-dashboard

---

## 🌐 Deploy to Render.com (Free Hosting)

Follow these steps to deploy your application publicly:

### **Step 1: Sign Up/Login to Render**

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (recommended)

### **Step 2: Create New Web Service**

1. Once logged in, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect GitHub account"** if not already connected
4. Grant Render access to your repositories

### **Step 3: Select Your Repository**

1. Find **"microburbs-property-dashboard"** in the list
2. Click **"Connect"**

### **Step 4: Configure the Web Service**

Fill in the following settings:

**Basic Settings:**
- **Name:** `microburbs-property-dashboard` (or choose your own)
- **Region:** Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch:** `main`
- **Root Directory:** (leave blank)

**Build & Deploy Settings:**
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `cd app && gunicorn app:app`

**Instance Type:**
- Select **"Free"** tier

**Environment Variables:**
Click "Add Environment Variable" and add:
- **Key:** `MICROBURBS_API_TOKEN`
- **Value:** `test` (or your actual API token)

- **Key:** `PYTHON_VERSION`
- **Value:** `3.11.6`

### **Step 5: Deploy**

1. Click **"Create Web Service"** at the bottom
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your application
3. Wait 2-5 minutes for deployment to complete

### **Step 6: Access Your Live Application**

Once deployed, you'll see:
- ✅ **Status:** "Live"
- 🌐 **URL:** `https://microburbs-property-dashboard.onrender.com` (or similar)

Click the URL to access your **publicly hosted** application!

---

## 📱 Alternative: Deploy to Railway.app

If you prefer Railway (also free):

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose **microburbs-property-dashboard**
6. Railway auto-detects Python and deploys
7. Add environment variable: `MICROBURBS_API_TOKEN=test`
8. Get your public URL from Railway dashboard

---

## 🔧 Configuration Files Included

Your repository includes all necessary deployment files:

✅ **Procfile** - Tells hosting service how to start the app  
✅ **runtime.txt** - Specifies Python version  
✅ **requirements.txt** - Lists all dependencies (including gunicorn)  
✅ **render.yaml** - Render.com configuration  
✅ **.gitignore** - Excludes unnecessary files from repo  

---

## 🌐 Your Live URLs

Once deployed, you'll have:

- **GitHub Repo:** https://github.com/LukeAndWinters/microburbs-property-dashboard
- **Live App:** `https://microburbs-property-dashboard.onrender.com` (after Render deployment)

---

## 🎯 Quick Deploy Button (Optional)

Add this to your README for one-click deployment:

```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
```

---

## 📊 Expected Deployment Time

- **Render.com:** 3-5 minutes
- **Railway.app:** 2-4 minutes
- **First deploy takes longer** (installs Python, dependencies)
- **Subsequent deploys:** ~1-2 minutes

---

## ✅ Verify Deployment

Once live, test your application:

1. Visit the deployment URL
2. Search for "Bondi" or "Melbourne"
3. Verify properties load with unique scores
4. Test "View Details" and "Load More" buttons
5. Check responsive design on mobile

---

## 🔄 Updating Your Live Application

Whenever you push to GitHub, the app will auto-deploy:

```bash
cd /Users/lukewinters/Documents/projects/microburbs/microburbs-dashboard
git add .
git commit -m "Update: your changes"
git push origin main
```

Render/Railway will automatically detect and deploy the changes!

---

## 🛠️ Troubleshooting

### Issue: App won't start
- Check Render logs for errors
- Verify `requirements.txt` is correct
- Ensure environment variables are set

### Issue: Static files not loading
- Check that paths use `url_for('static', filename='...')` in templates
- Verify static folder structure

### Issue: API errors
- Check `MICROBURBS_API_TOKEN` environment variable
- App falls back to demo data if API fails

---

## 🎉 You're Done!

Your Microburbs Property Dashboard is now:

✅ **Version controlled** on GitHub  
✅ **Publicly accessible** via live URL  
✅ **Auto-deploys** on every push  
✅ **Shareable** with anyone  

**Share your work:**
- GitHub: https://github.com/LukeAndWinters/microburbs-property-dashboard
- Live Demo: (your Render URL once deployed)

---

## 💡 Next Steps

1. Add your live URL to the repository description
2. Update README.md with deployment badge
3. Share the live link in your technical challenge submission
4. Consider adding custom domain (optional, requires paid plan)

Happy deploying! 🚀

