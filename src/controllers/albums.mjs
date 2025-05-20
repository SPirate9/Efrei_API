import Validator from 'better-validator';
import AlbumModel from '../models/album.mjs';

const Albums = class Albums {
  constructor(app, connect, AuthToken) {
    this.app = app;
    this.AlbumModel = connect.model('Album', AlbumModel);
    this.AuthToken = AuthToken;

    this.run();
  }

  getById() {
    this.app.get('/album/:id', this.AuthToken, (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  create() {
    this.app.post('/album', this.AuthToken, (req, res) => {
      try {
        const validator = new Validator();
        validator(req.body.title).required().isString().isLength({ min: 2, max: 100 });

        const errors = validator.run();
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }
        const albumModel = new this.AlbumModel(req.body);
        albumModel.save().then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/create -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  updateById() {
    this.app.put('/album/:id', this.AuthToken, (req, res) => {
      try {
        const validator = new Validator();
        validator(req.body.title).required().isString().isLength({ min: 2, max: 100 });
        const errors = validator.run();
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }
        this.AlbumModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  deleteById() {
    this.app.delete('/album/:id', this.AuthToken, (req, res) => {
      try {
        this.AlbumModel.findByIdAndDelete(req.params.id).then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  getAll() {
    this.app.get('/albums', this.AuthToken, (req, res) => {
      try {
        const filter = req.query.name ? { name: req.query.name } : {};
        this.AlbumModel.find(filter).then((albums) => {
          res.status(200).json(albums || []);
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  run() {
    this.create();
    this.getById();
    this.updateById();
    this.deleteById();
    this.getAll();
  }
};

export default Albums;
