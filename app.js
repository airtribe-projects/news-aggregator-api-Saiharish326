const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const axios=require('axios')
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;


const users=[];
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
}

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the news aggregator API by saiharish"
    })  ;
});
app.post('/users/signup',async (req,res)=>{
    const { name, email, password, preferences } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'Email already exists.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        users.push({ name, email, password: hashedPassword, preferences: preferences || [] });

        res.status(200).json({ message: 'User registered successfully.', hashedPassword });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user.' });
    }
});

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;   
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    } 
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }       
    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in.' });
    }

});  
app.put('/users/preferences', authenticateToken, (req, res) => {
    const { preferences } = req.body;
    if (!preferences || !Array.isArray(preferences)) {
        return res.status(400).json({ error: 'Preferences must be an array.' });
    }
    const user = users.find(u => u.email === req.user.email);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    user.preferences = preferences;
    res.json({ message: 'Preferences updated successfully.' });
});

app.get('/users/preferences', authenticateToken, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ preferences: user.preferences || [] });  
});
 app.get('/news',authenticateToken,async(req,res)=>{
    const user = users.find(u => u.email === req.user.email);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    const preferences = user.preferences || [];
    if (preferences.length === 0) {
        return res.status(400).json({ error: 'No preferences set.' });
    }

    try {
        // Fetch news for each preference (category/keyword)
        const articles = [];
        for (const topic of preferences) {
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: topic,
                    apiKey: NEWS_API_KEY,
                    language: 'en',
                    pageSize: 5
                }

            });
            articles.push(...response.data.articles);
        }
        //res.json({ articles });
        res.json({news: articles});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch news articles.' });
    }
 });


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${PORT}`);
});



module.exports = app;