#!/usr/bin/env node
/**
 * Pre-deployment validation script for FreshSip
 * Run this to check if your app is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 FreshSip Deployment Validation');
console.log('================================\n');

// Check if required files exist
const requiredFiles = [
    'vercel.json',
    'package.json',
    'api/[...path].js',
    'client/package.json',
    'client/vite.config.js',
    'server/package.json'
];

let allFilesPresent = true;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesPresent = false;
    }
});

// Check vercel.json configuration
console.log('\n⚙️  Checking vercel.json configuration...');
try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    if (vercelConfig.functions && vercelConfig.builds) {
        console.log('❌ vercel.json has both functions and builds properties - CONFLICT');
        allFilesPresent = false;
    } else {
        console.log('✅ vercel.json configuration valid');
    }
    
    if (vercelConfig.routes && vercelConfig.routes.length > 0) {
        console.log('✅ Routes configured');
    } else {
        console.log('❌ No routes configured');
        allFilesPresent = false;
    }
} catch (error) {
    console.log('❌ vercel.json invalid JSON or missing');
    allFilesPresent = false;
}

// Check API function
console.log('\n🔧 Checking API function...');
try {
    const apiFunction = fs.readFileSync('api/[...path].js', 'utf8');
    
    if (apiFunction.includes('try') && apiFunction.includes('catch')) {
        console.log('✅ Error handling implemented');
    } else {
        console.log('⚠️  No error handling detected');
    }
    
    if (apiFunction.includes('cachedConnection')) {
        console.log('✅ Connection caching implemented');
    } else {
        console.log('⚠️  No connection caching detected');
    }
} catch (error) {
    console.log('❌ API function not readable');
}

// Check package.json build scripts
console.log('\n📦 Checking build configuration...');
try {
    const clientPkg = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
    
    if (clientPkg.scripts && clientPkg.scripts.build) {
        console.log('✅ Client build script configured');
    } else {
        console.log('❌ Client build script missing');
        allFilesPresent = false;
    }
} catch (error) {
    console.log('❌ client/package.json not readable');
}

// Final result
console.log('\n🎯 Deployment Readiness Assessment');
console.log('==================================');

if (allFilesPresent) {
    console.log('🎉 SUCCESS: Your app is ready for Vercel deployment!');
    console.log('\nNext steps:');
    console.log('1. Set up MongoDB Atlas');
    console.log('2. Deploy to Vercel');
    console.log('3. Configure environment variables');
    console.log('\nFor detailed instructions, see DEPLOYMENT-CHECKLIST.md');
} else {
    console.log('❌ ISSUES DETECTED: Please fix the issues above before deploying');
    console.log('\nRefer to TROUBLESHOOTING.md for help');
}

console.log('\n📚 Documentation files:');
console.log('- README.md - Project overview');
console.log('- DEPLOYMENT-CHECKLIST.md - Step-by-step deployment');
console.log('- TROUBLESHOOTING.md - Error handling');
console.log('- DEPLOYMENT-STATUS.md - Current status');
