# Tamara - Daily Homework Digest (n8n Cloud)

Emails a homework digest every day at 3:30 PM (Saturday to Thursday, Asia/Riyadh) with the next 7 days of Schoology assignments. Items due today and tomorrow are flagged.

## Import
1. n8n → Workflows → Import from File → `n8n-tamara-daily-digest.json`
2. Node **Get Schoology calendar**: paste the Schoology Calendar → Export (iCal) link.
3. Node **Send to Latifah**: create a Gmail credential named `Gmail - Tamara School` and set the recipient.
4. Test the workflow only; leave it inactive until separately approved.

No personal data is stored in the file; the links and email live only in n8n.
PowerSchool has no calendar feed, so Arabic and Computer Science homework are not included.
