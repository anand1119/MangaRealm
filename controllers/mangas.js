const Manga = require('../models/manga');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const mangas = await Manga.find({});
    res.render('mangas/index', { mangas })
}

module.exports.renderNewForm = (req, res) => {
    res.render('mangas/new')
}

module.exports.createManga = async (req, res, next) => {
    const manga = new Manga(req.body.manga);
    manga.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    manga.author = req.user._id;
    await manga.save();
    console.log(manga);
    req.flash('success', 'Successfully made a new manga!');
    res.redirect(`/mangas/${manga._id}`);
}

module.exports.showManga = async (req, res) => {
    const manga = await Manga.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!manga){
        req.flash('error', 'Cannot find that manga!');
        return res.redirect('/mangas');
    }
    res.render('mangas/show', { manga });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const manga = await Manga.findById(id)
    if(!manga){
        req.flash('error', 'Cannot find that manga!');
        return res.redirect('/mangas');
    }
    res.render('mangas/edit', { manga });
}

module.exports.updateManga = async (req, res) => {
    const { id } = req.params;
    const manga = await Manga.findByIdAndUpdate(id, {...req.body.manga});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    manga.images.push(...imgs);
    await manga.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await manga.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated manga!');
    res.redirect(`/mangas/${manga._id}`);
}

module.exports.deleteManga = async (req, res) => {
    const { id } = req.params;
    await Manga.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted manga!');
    res.redirect('/mangas');
}