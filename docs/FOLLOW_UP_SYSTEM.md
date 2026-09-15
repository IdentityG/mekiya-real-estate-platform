# Automated Follow-up System

## Overview
The automated follow-up system tracks when leads need to be contacted and sends reminders to assigned agents.

## Features
- ✅ Schedule follow-up dates for leads
- ✅ Automatic reminders for overdue follow-ups
- ✅ In-app notifications for agents
- ✅ Lead activity tracking
- ✅ Integration with lead scoring

## How It Works

### 1. Setting Follow-up Dates
Agents can set follow-up dates for leads through the admin dashboard:

```typescript
POST /api/leads/follow-up
{
  "leadId": 123,
  "followUpDate": "2026-09-20T10:00:00Z",
  "note": "Follow up on property tour feedback"
}
```

### 2. Checking Due Follow-ups
Get all leads that need follow-up:

```typescript
GET /api/leads/follow-up?agentId=5
```

Response:
```json
{
  "success": true,
  "leads": [
    {
      "id": 123,
      "name": "John Doe",
      "nextFollowUpDate": "2026-09-15T10:00:00Z",
      "leadScore": 75,
      "agentName": "Sarah Anderson"
    }
  ],
  "count": 1
}
```

### 3. Automated Reminders (Cron Job)
Set up a cron job to send daily reminders:

```bash
# Run daily at 9 AM
PUT /api/leads/follow-up
Authorization: Bearer <CRON_SECRET>
```

## Deployment Setup

### Option 1: Vercel Cron Jobs
Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/leads/follow-up",
    "schedule": "0 9 * * *"
  }]
}
```

### Option 2: External Cron Service (cron-job.org, EasyCron)
1. Sign up for a cron service
2. Add job URL: `https://your-domain.com/api/leads/follow-up`
3. Set schedule: Daily at 9:00 AM
4. Add header: `Authorization: Bearer YOUR_CRON_SECRET`
5. Method: PUT

### Option 3: GitHub Actions
Create `.github/workflows/follow-up-reminders.yml`:

```yaml
name: Send Follow-up Reminders
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Send reminders
        run: |
          curl -X PUT https://your-domain.com/api/leads/follow-up \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Environment Variables

```env
# .env.local
CRON_SECRET=your-secure-random-secret-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Testing

Test the follow-up system locally:

```bash
# Set a follow-up date
curl -X POST http://localhost:3002/api/leads/follow-up \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "leadId": 1,
    "followUpDate": "2026-09-20T10:00:00Z",
    "note": "Test follow-up"
  }'

# Check due follow-ups
curl http://localhost:3002/api/leads/follow-up

# Trigger reminders (requires CRON_SECRET)
curl -X PUT http://localhost:3002/api/leads/follow-up \
  -H "Authorization: Bearer dev-secret-change-in-production"
```

## Dashboard Integration

The Smart Lead Dashboard shows:
- 🔥 **Needs Follow-up Badge**: Leads with overdue follow-ups
- 📊 **Follow-up Counter**: Total leads needing attention
- 📅 **Next Follow-up Date**: Displayed in lead details

## Best Practices

1. **Set Realistic Follow-up Dates**
   - Hot leads (score 70+): 1-2 days
   - Warm leads (score 40-69): 3-5 days
   - Cold leads (score <40): 1 week

2. **Add Context Notes**
   - Always add notes when scheduling follow-ups
   - Reference previous conversations
   - Note specific concerns or interests

3. **Monitor Follow-up Rate**
   - Track how quickly agents respond to follow-ups
   - Use lead scoring to prioritize hot leads

4. **Automate Where Possible**
   - Use cron jobs for daily reminders
   - Set up SMS/email notifications (future enhancement)

## Future Enhancements

- [ ] SMS notifications via Twilio
- [ ] Email reminders with templates
- [ ] WhatsApp reminders
- [ ] AI-powered follow-up suggestions
- [ ] Automatic lead re-assignment for missed follow-ups
- [ ] Follow-up analytics and reporting

## Troubleshooting

### Reminders not sending
1. Check CRON_SECRET is set correctly
2. Verify cron job is running (check logs)
3. Ensure leads have assigned agents
4. Check notification table for errors

### Follow-up dates not updating
1. Verify agent has permission (staff role)
2. Check date format (ISO 8601)
3. Ensure lead exists and is not closed

### Performance issues
1. Add database index on `next_follow_up_date`
2. Limit cron job to process 100 leads at a time
3. Use background job queue for large volumes
