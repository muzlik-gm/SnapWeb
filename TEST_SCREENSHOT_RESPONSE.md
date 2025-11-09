# Screenshot Response Debugging

## Expected API Response Structure

```json
{
  "success": true,
  "data": {
    "id": "some-id",
    "imageUrl": "/screenshots/screenshot_timestamp_random.png",
    "metadata": {
      "width": 1920,
      "height": 1080,
      "fileSize": 123456,
      "format": "png",
      "captureTime": 2500,
      "deviceType": "desktop"
    }
  },
  "message": "Screenshot generated successfully"
}
```

## Frontend Expected Structure

The frontend expects `data.data.imageUrl` because:
- API returns: `{ success: true, data: { imageUrl: "..." } }`
- Frontend accesses: `data.data.imageUrl`

## Debugging Steps

1. **Check Browser Console**:
   - Look for: `Screenshot API Response: { id: "...", imageUrl: "/screenshots/...", metadata: {...} }`
   - This shows what the frontend received

2. **Check Server Logs**:
   - Look for: `Sending screenshot response: { id: "...", imageUrl: "/screenshots/...", metadata: {...} }`
   - This shows what the API sent

3. **Check Image URL**:
   - The page now shows the image URL below the preview
   - Check if the URL is correct (should be `/screenshots/filename.png`)

4. **Check if Image Loads**:
   - If image shows "Image failed to load", check browser Network tab
   - Look for the screenshot request and see if it returns 404 or 200

5. **Check File System**:
   - Screenshots are saved in: `public/screenshots/`
   - Files should be named: `screenshot_timestamp_random.png`

## Common Issues

### Issue 1: Image URL is undefined
- **Cause**: API response structure mismatch
- **Fix**: Ensure API returns `data.imageUrl` not just `imageUrl`

### Issue 2: Image shows but is blank/white
- **Cause**: File not saved or wrong path
- **Fix**: Check if file exists in `public/screenshots/`

### Issue 3: Download doesn't work
- **Cause**: Image URL is incorrect or file doesn't exist
- **Fix**: Verify the download link href matches the saved file path

## Testing

Try these URLs in your browser:
1. `http://localhost:3000/screenshots/screenshot_1762335126161_otkog2q9llq.png`
2. Check if any of the existing screenshots load

If they load, the issue is with the response structure.
If they don't load, the issue is with Next.js static file serving.