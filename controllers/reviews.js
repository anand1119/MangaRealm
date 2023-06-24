const Manga = require('../models/manga');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const manga = await Manga.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    manga.reviews.push(review);
    await review.save();
    await manga.save(); 
    req.flash('success', 'Created new review!');
    res.redirect(`/mangas/${manga._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Manga.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/mangas/${id}`);
}