# Kemono Friends Sorter Backend

Character Sorter for Kemono Friends

https://japari-library.github.io/kemosorter/


## Features
- Update Character List (and their Categories)
- Save/Load sorter progress
- Save/View sorter results

## Build & Run

### NPM

```
npm install
npm start
```

### Docker
```
docker build . -t <username>/kemosorter-server
docker run -p <host port>:<PORT> -d <username>/kemosorter-server
```

Access backend via `localhost:<host port>`

### Environment Variables
- `DATABASE_URL` : URL to MongoDB Server
- `SECRET` : Access Key to add/modify categories/characters
- `PORT` : (Optional) Port to host server (Default: 5000)

*Work in Progress*
