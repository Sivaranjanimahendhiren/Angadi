const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

async function generateSitemap() {
  const hostname = 'https://angadi.com';

  const pages = [
    '/',
    '/home',
    '/cart',
    '/orders',
    '/product-details',
    '/checkout',
  ];

  const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
  const sitemapStream = new SitemapStream({ hostname });

  // Capture stream output in memory AND write to file
  const writeStream = createWriteStream(sitemapPath);
  const pipeline = sitemapStream.pipe(writeStream);

  pages.forEach((page) => {
    sitemapStream.write({ url: page, changefreq: 'daily', priority: 0.8 });
  });

  sitemapStream.end();

  // Wait for both streams to finish
  await streamToPromise(sitemapStream);
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  console.log('✅ Sitemap successfully created at public/sitemap.xml');
}

generateSitemap().catch(console.error);
