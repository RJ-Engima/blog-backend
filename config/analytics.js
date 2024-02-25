const { google } = require('googleapis');
const key = require('./key.json'); // Your service account key JSON file

// Create a new JWT client using the key file
const jwtClient = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

// Google Analytics reporting API version
const analyticsreporting = google.analyticsreporting({
    version: 'v4',
    auth: jwtClient,
});

// View ID of your Google Analytics property
const VIEW_ID = 'YOUR_VIEW_ID'; // Replace with your view ID

// Retrieve pageviews for each blog post
async function getPageViews() {
    try {
        const response = await analyticsreporting.reports.batchGet({
            requestBody: {
                reportRequests: [
                    {
                        viewId: VIEW_ID,
                        dateRanges: [
                            {
                                startDate: '7daysAgo',
                                endDate: 'today',
                            },
                        ],
                        metrics: [
                            {
                                expression: 'ga:pageviews',
                            },
                        ],
                        dimensions: [
                            {
                                name: 'ga:pagePath',
                            },
                        ],
                        orderBys: [
                            {
                                fieldName: 'ga:pageviews',
                                sortOrder: 'DESCENDING',
                            },
                        ],
                    },
                ],
            },
        });

        const rows = response.data.reports[0].data.rows;

        if (rows && rows.length) {
            const pageViewsData = rows.map(row => {
                return {
                    pagePath: row.dimensions[0],
                    pageViews: parseInt(row.metrics[0].values[0], 10),
                };
            });

            console.log('Pageviews for each blog post:', pageViewsData);
        } else {
            console.log('No data found.');
        }
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
}

// Call the function to retrieve pageviews
getPageViews();
