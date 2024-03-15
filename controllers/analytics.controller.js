import path from "path";
import logger from '../config/logger.js';
import { google } from "googleapis";
import { fileURLToPath } from "url";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import PostSchema from '../models/post.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const analyticsDataClient = new BetaAnalyticsDataClient();



export const getAnalytics = async (req, res) => {
  logger.info("Google Analytics data API hit.")
  const scopes = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/analytics",
  ];
  const VIEW_ID = "401185356";
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes
  );

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../config/m2p-blog-analytics.json"),
    scopes,
  });
  google.options({ auth });
  await jwtClient.authorize();

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${VIEW_ID}`,
      "dimensions": [{ "name": "unifiedPagePathScreen" }], "metrics": [{ "name": "screenPageViews" }], "dateRanges": [{ "startDate": "2020-01-01", "endDate": "today" }], "metricAggregations": ["TOTAL", "MINIMUM", "MAXIMUM"]
    });
    const analytics = []
    Array.from(response.rows).map((item) => {
      analytics.push({
        link: item.dimensionValues[0].value,
        views: item.metricValues[0].value,
      })
    })
    for (const item of analytics) {
      await PostSchema.updateOne(
        { post_name: item.link.split("/blog/").pop().replace(/\/$/, '') },
        { views: item.views }
      );
    }
    logger.info("Success retrieving analytics data");
    res.success(200, "Success retrieving analytics data", analytics);
  } catch (error) {
    console.log(error);
    logger.error("Error retrieving analytics data:", error);
    res.error(500, "Error retrieving analytics data", error.message);
  }
};
export const getAnalyticsLocation = async (req, res) => {
  logger.info("Google Analytics location data API hit.")
  const scopes = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/analytics",
  ];
  const VIEW_ID = "401185356";
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes
  );

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../config/m2p-blog-analytics.json"),
    scopes,
  });
  google.options({ auth });
  await jwtClient.authorize();

  try {
    const [city] = await analyticsDataClient.runReport({
      property: `properties/${VIEW_ID}`,
      "dimensions": [{ "name": "country" }], "metrics": [{ "name": "screenPageViews" }], "dateRanges": [{ "startDate": "2020-01-01", "endDate": "today" }], "metricAggregations": ["TOTAL", "MINIMUM", "MAXIMUM"]
    });
    const overall = {
      totals: {
        dimensionValues: city.totals[0].dimensionValues[0],
        metricValues: city.totals[0].metricValues[0],
      },
      maximums: {
        dimensionValues: city.totals[0].dimensionValues[0],
        metricValues: city.totals[0].metricValues[0],
      },
      minimums: {
        dimensionValues: city.totals[0].dimensionValues[0],
        metricValues: city.totals[0].metricValues[0],
      },
    }
    console.log(overall);

    const cityData = []
    Array.from(city.rows).map((item) => {
      cityData.push({
        city: item.dimensionValues[0].value,
        views: item.metricValues[0].value,
      })
    })
    console.log(cityData.length);
    logger.info("Success retrieving analytics data");
    res.success(200, "Success retrieving analytics data", cityData);
  } catch (error) {
    console.log(error);
    logger.error("Error retrieving analytics data:", error);
    res.error(500, "Error retrieving analytics data", error.message);
  }
};
export const getAnalyticsTrending = async (req, res) => {
  logger.info("Google Analytics location data API hit.")
  const scopes = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/analytics",
  ];
  const VIEW_ID = "401185356";
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes
  );

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../config/m2p-blog-analytics.json"),
    scopes,
  });
  google.options({ auth });
  await jwtClient.authorize();

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${VIEW_ID}`,
      "dimensions": [{ "name": "unifiedPageScreen" }], "metrics": [{ "name": "screenPageViews" }], "dateRanges": [{ "startDate": "30daysAgo", "endDate": "today" }], "metricAggregations": ["TOTAL", "MINIMUM", "MAXIMUM"],
      "limit": 11
    });
    const analytics = []
    Array.from(response.rows).map((item) => {
      analytics.push({
        link: item.dimensionValues[0].value,
        views: item.metricValues[0].value,
      })
    })
    for (const item of analytics) {
      await PostSchema.updateOne(
        { post_name: item.link.split("/blog/").pop().replace(/\/$/, '') },
        { trending: {
          status: true,
          views: item.views
        } }
      );
    }
    logger.info("Success retrieving analytics data");
    res.success(200, "Success retrieving analytics data", analytics);
  } catch (error) {
    console.log(error);
    logger.error("Error retrieving analytics data:", error);
    res.error(500, "Error retrieving analytics data", error.message);
  }
};