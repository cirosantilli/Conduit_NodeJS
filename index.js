const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {notFound, errorHandler} = require('./middleware/errorHandler');
const sequelize = require('./dbConnection');

const User = require('./models/User');
const Article = require('./models/Article');
const Tag = require('./models/Tag');
const Comment = require('./models/Comments');

const userRoute = require('./routes/users');
const articleRoute = require('./routes/articles');
const commentRoute = require('./routes/comments');
const tagRoute = require('./routes/tags');
const profileRoute = require('./routes/profile');
const favouriteRoute = require('./routes/favourites');

(async () => {
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
    process.exit(1);
  }
}
checkConnection()
// Sequelize.
// 1 to many relation between user and article
User.hasMany(Article, {onDelete: 'CASCADE'});
Article.belongsTo(User);
// Many to many relation between article and taglist
Article.belongsToMany(Tag, {through: 'TagList', uniqueKey:false, timestamps:false});
Tag.belongsToMany(Article, {through: 'TagList', uniqueKey:false, timestamps:false});
// One to many relation between Article and Comments
Article.hasMany(Comment, {onDelete: 'CASCADE'});
Comment.belongsTo(Article);
// One to many relation between User and Comments
User.hasMany(Comment, {onDelete: 'CASCADE'});
Comment.belongsTo(User);
// Many to many relation between User and User
User.belongsToMany(User, {
    through:'Followers',
    as:'followers',
    timestamps:false,
});
// Favourite Many to many relation between User and article
User.belongsToMany(Article, {through: 'Favourites', timestamps:false});
Article.belongsToMany(User, {through: 'Favourites', timestamps:false});
// TODO this drops the database every time: {alter:true}.
await sequelize.sync();

// App.
const app = express();
app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(morgan('tiny'));
app.get('/', (req, res) => {
    res.json({status:"API is running"});
})
app.use('/api', userRoute);
app.use('/api/articles', articleRoute);
app.use('/api/articles', commentRoute);
app.use('/api/tags', tagRoute);
app.use('/api/profiles', profileRoute);
app.use('/api/articles', favouriteRoute);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
})();
