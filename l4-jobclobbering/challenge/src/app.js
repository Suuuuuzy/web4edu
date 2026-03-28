const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs')
const app = express();
const bot = require('./bot/bot');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

app.use((err, req, res, next) => {
    process.exit(1);
});

app.use((req, res, next) => {
    res.set('Content-Security-Policy',
        "script-src 'self' https://cdnjs.cloudflare.com 'unsafe-eval'; style-src 'self' https://unpkg.com/ 'unsafe-inline';");
    next();
});
 

app.use((err, req, res, next) => {
    process.exit(1);
});

/**
 * Render the Job Hunting Page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

/**
 * recruiter will visit this page to view candidate's resume
 */
app.post('/submit', async (req, res) => {
    try {
        await bot.visit(req.body.url).catch(err => console.error('Error visiting URL:', err));
        res.send('Our agent will evaluate your resume and get back to you soon!')
    } catch (error) {
        res.send('Nice Try!')
    }
})

app.get('/search', (req, res) => {
    if (!req.query.q) {
        res.send({
            results: 'No search query provided!'
        });
        return;
    }
    const searchQuery = req.query.q;
    res.send({
        results: `No results found for: ${searchQuery}`
    });
});

app.get('/redirect', (req, res) => {
    try {
        const parsedUrl = new URL(req.query.url);
        if ((parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:')) {
            res.redirect(req.query.url);
        } else {
            res.send('<h1>Malicious URL detected</h1>');
        }
    } catch (error) {
        res.send('<h1>Malicious URL detected</h1>');
    }
})

app.get('/jobs', (req, res) => {
    res.send({
        messages: `<div id="job-listings">
                <h2>Featured Job Listings</h2>
                <p>Browse our latest job opportunities in Baltimore and surrounding areas.</p>

                <div class="job-card">
                    <h3>Security Engineer</h3>
                    <p><strong>Location:</strong> Baltimore</p>
                    <p><strong>Salary:</strong> $100,000 - $150,000</p>
                    <p><strong>Type:</strong> Full-time</p>
                </div>
                
                <div class="job-card">
                    <h3>Software Engineer</h3>
                    <p><strong>Location:</strong> Baltimore</p>
                    <p><strong>Salary:</strong> $90,000 - $120,000</p>
                    <p><strong>Type:</strong> Full-time</p>
                </div>
                
                <div class="job-card">
                    <h3>Marketing Manager</h3>
                    <p><strong>Location:</strong> Baltimore</p>
                    <p><strong>Salary:</strong> $75,000 - $95,000</p>
                    <p><strong>Type:</strong> Full-time</p>
                </div>
                
                <div class="job-card">
                    <h3>Data Analyst</h3>
                    <p><strong>Location:</strong> Remote (Baltimore-based company)</p>
                    <p><strong>Salary:</strong> $65,000 - $85,000</p>
                    <p><strong>Type:</strong> Full-time</p>
                </div>

            </div>`
    });
});

Messages = [
    "Jenny:::What's the salary range for software engineer in Baltimore?:::2025-09-15 18:22:51",
    "Jack:::I'm looking for a job as a security engineer in Baltimore. Can you help me find a job?:::2025-09-16 06:12:01"
]

app.get('/messages', (req, res) => {
    if (req.query.count) {
        res.send({
            count: Messages.length
        });
    }
    else if (req.query.id && req.query.id < Messages.length) {
        const window = (new JSDOM('')).window;
        const DOMPurify = createDOMPurify(window);
        res.send(DOMPurify.sanitize(Messages[req.query.id]));
    }
    else {
        res.send(`Error: Invalid query`);
    }
});

app.post('/messages', (req, res) => {
    if (req.body.name && req.body.message) {
        Messages.push(`${req.body.name}:::${req.body.message}:::${new Date().toISOString()}`);
        res.send(`Message added successfully`);
    }
    else {
        res.send(`Error: Invalid query`);
    }
});

const PORT = process.env.PORT || 8399;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});