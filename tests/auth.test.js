require('dotenv').config(); // load .env variables

const mongoose = require("mongoose");
let dotenv = require("dotenv")
const { worker,  redisConnection, addLoginEmailToQueue } =require("../queues/emailQueue");
const sendWelcomeEmail = require("../emails/signupWelcome");
const request = require("supertest");
const {test, expect} = require("@playwright/test");
//const {app, server} = require("../app");
const bcrypt = require("bcryptjs")
const userModel = require('../models/user-model')



test('Signup user test', async ({ page }) => {
  // Go to register page
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle' });
  console.log("✅ Register page loaded");
 await page.click('.toggle-login');
 await page.waitForSelector('#loginForm', { state: 'visible' });
await page.fill('#loginForm input[name="email"]', 'test@gmail.com');
await page.fill('#loginForm input[name="password"]', 'test123');

// Submit form
await page.click('#loginForm button[type="submit"]');
  // Wait for redirect
  await page.waitForURL('http://localhost:3000/profile');
 
  await expect(page).toHaveURL('http://localhost:3000/profile');
});
