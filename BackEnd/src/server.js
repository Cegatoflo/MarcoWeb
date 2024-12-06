import app from './app.js';
import { connectDB } from './db.js';

connectDB()

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Server running on port', port);
});