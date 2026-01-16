# Render Configuration Quick Reference

## Web Service Settings

**Root Directory:**

```
backend
```

**Build Command:**

```bash
pip install -r requirements.txt
```

**Start Command:**

```bash
gunicorn src.app:app --bind 0.0.0.0:$PORT
```

## Environment Variables

Copy these into Render's Environment section:

### Required

```
DATABASE_URL=[Paste from Render PostgreSQL Internal URL]
SECRET_KEY=[Generate with: python -c "import secrets; print(secrets.token_hex(32))"]
ALLOWED_ORIGINS=chrome-extension://YOUR_EXTENSION_ID_HERE
```

### Optional

```
FLASK_ENV=production
PYTHON_VERSION=3.10.0
```

## After Deployment

Your API will be at:

```
https://YOUR-SERVICE-NAME.onrender.com
```

Update your extension's API base URL to this address.

## Verify Deployment

Test health check:

```bash
curl https://YOUR-SERVICE-NAME.onrender.com/
```

Should return:

```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "message": "CodeClip API is running"
  },
  "error": ""
}
```
