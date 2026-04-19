const app = require('./taskApp'); 

console.log("APP TYPE:", typeof app); // debug

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});