# Setu API Postman Collection Setup

## Environment Variables Setup

1. Create a new Environment in Postman called "Setu Sandbox"
2. Add these variables:

```
x-client-id: {{your_client_id}}
x-client-secret: {{your_client_secret}}  
x-product-instance-id: {{your_product_instance_id}}
base-url: https://dg-sandbox.setu.co
```

## Collection Structure

### 1. Upload Document
**POST** `{{base-url}}/api/documents`

Headers:
```
x-client-id: {{x-client-id}}
x-client-secret: {{x-client-secret}}
x-product-instance-id: {{x-product-instance-id}}
Content-Type: multipart/form-data
```

Body (form-data):
```
name: sample-contract.pdf
document: [Select PDF file]
```

Expected Response:
```json
{
  "documentId": "doc_abc123",
  "status": "uploaded"
}
```

### 2. Create Signature Request
**POST** `{{base-url}}/api/signature`

Headers:
```
x-client-id: {{x-client-id}}
x-client-secret: {{x-client-secret}}
x-product-instance-id: {{x-product-instance-id}}
Content-Type: application/json
```

Body (JSON):
```json
{
  "documentId": "{{documentId}}", 
  "redirectUrl": "https://your-app.com/status",
  "signers": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

Expected Response:
```json
{
  "signatureId": "sig_xyz789",
  "signatureUrl": "https://sign.setu.co/abc123",
  "status": "pending"
}
```

### 3. Check Signature Status
**GET** `{{base-url}}/api/signature/{{signatureId}}`

Headers:
```
x-client-id: {{x-client-id}}
x-client-secret: {{x-client-secret}}
x-product-instance-id: {{x-product-instance-id}}
```

Expected Response:
```json
{
  "signatureId": "sig_xyz789",
  "status": "completed",
  "signedAt": "2024-01-15T10:30:00Z",
  "documentId": "doc_abc123"
}
```

### 4. Download Signed Document  
**GET** `{{base-url}}/api/documents/{{documentId}}/download`

Headers:
```
x-client-id: {{x-client-id}}
x-client-secret: {{x-client-secret}}
x-product-instance-id: {{x-product-instance-id}}
```

Expected Response: PDF file download

## Testing Workflow

1. **Upload Document** → Save `documentId` from response
2. **Create Signature** → Save `signatureId` and `signatureUrl` 
3. **Open Signature URL** → Complete signing process in browser
4. **Check Status** → Poll until status = "completed"
5. **Download Signed** → Get final signed document

## Video Recording Checklist

Record yourself demonstrating:
- ✅ Setting up environment variables
- ✅ Running each API request in sequence
- ✅ Showing request headers and payloads
- ✅ Displaying successful responses
- ✅ Opening signature URL and completing flow
- ✅ Final download of signed document

## Notes

- Replace `{{your_client_id}}` etc. with actual Setu sandbox credentials
- Test with a simple PDF file (under 10MB)
- Ensure all requests return 200/201 status codes
- Save this collection for later frontend integration reference