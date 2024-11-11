-- Note
-- add age, id_google to user
-- add on update, on delete
ALTER DATABASE groovo CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

use groovo;

-- Drop tables if they exist
DROP TABLE IF EXISTS FavoriteAlbum;

DROP TABLE IF EXISTS FavoriteMusic;

DROP TABLE IF EXISTS Follow;

DROP TABLE IF EXISTS MusicHistory;

DROP TABLE IF EXISTS MusicTypeDetail;

DROP TABLE IF EXISTS Lyrics;

DROP TABLE IF EXISTS MusicPlaylistDetail;

DROP TABLE IF EXISTS MusicAlbumDetail;

DROP TABLE IF EXISTS MusicArtistDetail;

DROP TABLE IF EXISTS Playlist;

DROP TABLE IF EXISTS Album;

DROP TABLE IF EXISTS Music;

DROP TABLE IF EXISTS Type;

DROP TABLE IF EXISTS Artist;

DROP TABLE IF EXISTS User;

CREATE TABLE User (
    id_user VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    fullname VARCHAR(255) NOT NULL,
    phone VARCHAR(12) UNIQUE,
    gender ENUM('male', 'female'),
    url_avatar VARCHAR(255),
    birthday DATE,
    country VARCHAR(255),
    created_at DATETIME DEFAULT NOW(),
    last_update DATETIME DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    is_banned TINYINT(1) DEFAULT 0,
    id_google varchar(255),
    reset_token VARCHAR(255),
    reset_token_expired bigint(20)
);

CREATE TABLE Artist (
    id_artist VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    url_cover VARCHAR(255),
    created_at DATETIME DEFAULT NOW(),
    last_update DATETIME DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    is_show TINYINT(1) DEFAULT 1
);

CREATE TABLE Music (
    id_music VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    url_path VARCHAR(255) not null,
    url_cover VARCHAR(255),
    total_duration INT DEFAULT 0,
    producer varchar(255),
    composer varchar(255),
    release_date DATE,
    created_at DATETIME DEFAULT NOW(),
    last_update DATETIME DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    is_show TINYINT(1) DEFAULT 1
);

CREATE TABLE Type (
    id_type VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT NOW(),
    is_show TINYINT(1) DEFAULT 1
);

CREATE TABLE Album (
    id_album VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    id_artist VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    url_cover VARCHAR(255),
    release_date DATE,
    publish_by VARCHAR(255),
    created_at DATETIME DEFAULT NOW(),
    last_update DATETIME DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    is_show TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_artist) REFERENCES Artist(id_artist) ON DELETE
    SET
        NULL ON UPDATE CASCADE
);

CREATE TABLE Playlist (
    id_playlist VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    id_user VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    playlist_index integer default 0,
    created_at DATETIME DEFAULT NOW(),
    last_update DATETIME DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MusicArtistDetail (
    id_artist VARCHAR(36) NOT NULL,
    id_music VARCHAR(36) NOT NULL,
    PRIMARY KEY (id_artist, id_music),
    FOREIGN KEY (id_artist) REFERENCES Artist(id_artist) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MusicAlbumDetail (
    id_music VARCHAR(36) NOT NULL,
    id_album VARCHAR(36) NOT NULL,
    index_order INT DEFAULT 0,
    PRIMARY KEY (id_music, id_album),
    FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_album) REFERENCES Album(id_album) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MusicPlaylistDetail (
    id_playlist VARCHAR(36) NOT NULL,
    id_music VARCHAR(36) NOT NULL,
    index_order INT DEFAULT 0,
    PRIMARY KEY (id_playlist, id_music),
    FOREIGN KEY (id_playlist) REFERENCES Playlist(id_playlist) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Lyrics (
    id_lyrics VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    id_music VARCHAR(36) NOT NULL,
    lyrics TEXT,
    start_time INT DEFAULT 0,
    end_time INT DEFAULT 0,
    FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MusicTypeDetail (
    id_music VARCHAR(36) NOT NULL,
    id_type VARCHAR(36) NOT NULL,
    PRIMARY KEY (id_music, id_type),
    FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_type) REFERENCES Type(id_type) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MusicHistory (
    id_music_history VARCHAR(36) DEFAULT UUID() NOT NULL PRIMARY KEY,
    id_user VARCHAR(36) NOT NULL,
    id_music VARCHAR(36) NOT NULL,
    play_duration INT,
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Follow (
    id_user VARCHAR(36) NOT NULL,
    id_artist VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    PRIMARY KEY (id_user, id_artist),
    FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_artist) REFERENCES Artist(id_artist) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE FavoriteMusic (
    id_user VARCHAR(36) NOT NULL,
    id_music VARCHAR(36) NOT NULL,
    last_update DATETIME DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_music),
    FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE FavoriteAlbum (
    id_user VARCHAR(36) NOT NULL,
    id_album VARCHAR(36) NOT NULL,
    last_update DATETIME DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_album),
    FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_album) REFERENCES Album(id_album) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Trigger for User table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_user_update
-- BEFORE UPDATE ON User
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- -- Trigger for Artist table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_artist_update
-- BEFORE UPDATE ON Artist
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- -- Trigger for Music table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_music_update
-- BEFORE UPDATE ON Music
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- -- Trigger for Album table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_album_update
-- BEFORE UPDATE ON Album
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- Trigger for Playlist table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_playlist_update
-- BEFORE UPDATE ON Playlist
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- Trigger for Membership table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_membership_update
-- BEFORE UPDATE ON Membership
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- Trigger for FavoriteMusic table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_favorite_music_update
-- BEFORE UPDATE ON FavoriteMusic
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- -- Trigger for NotificationStatus table
-- DELIMITER //
-- CREATE OR REPLACE TRIGGER before_notification_status_update
-- BEFORE UPDATE ON NotificationStatus
-- FOR EACH ROW
-- BEGIN
--     SET NEW.last_update = NOW();
-- END//
-- DELIMITER ;
-- Add user
INSERT INTO
    User (
        id_user,
        fullname,
        email,
        password,
        role,
        phone,
        gender,
        url_avatar,
        birthday,
        country,
        created_at,
        last_update,
        is_banned
    )
VALUES
    (
        'u0001',
        'Phạm Tuấn Anh',
        'anhpt2611@gmail.com',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'admin',
        NULL,
        'female',
        NULL,
        '2003-12-25',
        'VN',
        "2024-08-17T15:11:11z",
        "2024-08-17T15:11:11z",
        0
    ),
    (
        'u0002',
        'Bùi Huy Vũ',
        'vuy8huyhoang@gmail.com',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'admin',
        '1234567890',
        'male',
        'https://example.com/avatars/johndoe.jpg',
        '2003-05-15',
        'VN',
        "2024-08-17T15:11:11z",
        "2024-08-17T15:11:11z",
        0
    ),
    (
        'u0003',
        'Lê Cao Hữu Phúc',
        'huuphuc1203@gmail.com',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'admin',
        '0987654322',
        NULL,
        'https://example.com/avatars/alicejones.jpg',
        NULL,
        'VN',
        "2024-08-17T15:11:11z",
        "2024-08-17T15:11:11z",
        0
    ),
    (
        'u0004',
        "Chu Văn Trường",
        'truongchu431@gmail.com',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'admin',
        NULL,
        NULL,
        NULL,
        NULL,
        'VN',
        "2024-08-17T15:11:11z",
        "2024-08-17T15:11:11z",
        0
    ),
    (
        'u0005',
        'Lê Tuấn Kiệt',
        'kietdeptrai1912@gmail.com',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'admin',
        '1231231234',
        'female',
        'https://example.com/avatars/carolwhite.jpg',
        '2003-07-20',
        "VN",
        "2024-08-17T15:11:11z",
        "2024-08-17T15:11:11z",
        0
    );

insert into
    User (
        id_user,
        password,
        role,
        fullname,
        email,
        phone,
        gender,
        url_avatar,
        birthday,
        is_banned
    )
values
    (
        'u0006',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Babb Heyburn',
        'babb.heyburn@gmail.com',
        '1872318438',
        null,
        null,
        '10/1/2023',
        1
    ),
    (
        'u0007',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Tabina Djokic',
        'tabina.djokic@gmail.com',
        '1478437202',
        null,
        null,
        null,
        0
    ),
    (
        'u0008',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Leonard Bransdon',
        'leonard.bransdon@gmail.com',
        null,
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/y1t83x6vwbxazwnmcgke.png',
        null,
        0
    ),
    (
        'u0009',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Tabby Radbourne',
        'tabby.radbourne@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/qz4kqwj4f4curejrrc7x.png',
        '3/14/2024',
        0
    ),
    (
        'u0010',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Sada Baszkiewicz',
        'sada.baszkiewicz@gmail.com',
        null,
        null,
        null,
        '10/10/2023',
        1
    ),
    (
        'u0011',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Bertha Astles',
        'bertha.astles@gmail.com',
        '2966293522',
        'male',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/hiegaoaqc31vld7iiyxx.png',
        null,
        0
    ),
    (
        'u0012',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Layney Treppas',
        'layney.treppas@gmail.com',
        null,
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/zv8i7byhf6uhgrxwir9a.png',
        '3/4/2024',
        0
    ),
    (
        'u0013',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Ariella Matley',
        'ariella.matley@gmail.com',
        '7917887887',
        null,
        null,
        '1/19/2024',
        0
    ),
    (
        'u0014',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Doe Cicero',
        'doe.cicero@gmail.com',
        '4232141192',
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/wmwifpgevvpwcb78tvxi.png',
        '10/10/2023',
        0
    ),
    (
        'u0015',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Valaree Luberti',
        'valaree.luberti@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/r74itcqp4mbsrvnozg3o.png',
        '8/2/2024',
        0
    ),
    (
        'u0016',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Ignatius Fouracre',
        'ignatius.fouracre@gmail.com',
        '2827043216',
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/l5mfkivokjtwayirww6j.png',
        '5/19/2024',
        1
    ),
    (
        'u0017',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Catharine Carrabott',
        'catharine.carrabott@gmail.com',
        '2386969751',
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/y1t83x6vwbxazwnmcgke.png',
        '9/11/2024',
        1
    ),
    (
        'u0018',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Clark Shevlan',
        'clark.shevlan@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/e8dr5blfidt0ougqayd9.png',
        null,
        0
    ),
    (
        'u0019',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Roselia Danilchev',
        'roselia.danilchev@gmail.com',
        null,
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/hiegaoaqc31vld7iiyxx.png',
        null,
        0
    ),
    (
        'u0020',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Ciro Kharchinski',
        'ciro.kharchinski@gmail.com',
        null,
        'female',
        null,
        null,
        1
    ),
    (
        'u0021',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Karol Stanyer',
        'karol.stanyer@gmail.com',
        null,
        null,
        null,
        null,
        1
    ),
    (
        'u0022',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Bradly Bonham',
        'bradly.bonham@gmail.com',
        null,
        'female',
        null,
        '6/3/2024',
        1
    ),
    (
        'u0023',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Kerr Menelaws',
        'kerr.menelaws@gmail.com',
        null,
        null,
        null,
        '9/16/2023',
        0
    ),
    (
        'u0024',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Berta Hebard',
        'berta.hebard@gmail.com',
        '9917375949',
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/l5mfkivokjtwayirww6j.png',
        null,
        1
    ),
    (
        'u0025',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Donica Wait',
        'donica.wait@gmail.com',
        '3767474529',
        'male',
        null,
        null,
        0
    ),
    (
        'u0026',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Duky Arlidge',
        'duky.arlidge@gmail.com',
        null,
        'female',
        null,
        '10/5/2023',
        0
    ),
    (
        'u0027',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Natalina Foakes',
        'natalina.foakes@gmail.com',
        '6272624549',
        'female',
        null,
        null,
        1
    ),
    (
        'u0028',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Ailsun Tregien',
        'ailsun.tregien@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/fdywfgg5usn96yyfy9bf.png',
        '12/8/2023',
        1
    ),
    (
        'u0029',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Brok Jaze',
        'brok.jaze@gmail.com',
        '9439602673',
        'male',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/bntxyial7tgerlkiueyu.png',
        null,
        1
    ),
    (
        'u0030',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Clair Sebastian',
        'clair.sebastian@gmail.com',
        null,
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/utkhrxchgmkjsirfmrmp.png',
        null,
        0
    ),
    (
        'u0031',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Miguelita Pinckney',
        'miguelita.pinckney@gmail.com',
        '5053114347',
        'male',
        null,
        null,
        1
    ),
    (
        'u0032',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Giles Gabbidon',
        'giles.gabbidon@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/l5mfkivokjtwayirww6j.png',
        '6/5/2024',
        1
    ),
    (
        'u0033',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Rodrick English',
        'rodrick.english@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/bntxyial7tgerlkiueyu.png',
        null,
        1
    ),
    (
        'u0034',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Niles Skirving',
        'niles.skirving@gmail.com',
        null,
        'male',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/fdywfgg5usn96yyfy9bf.png',
        '12/15/2023',
        1
    ),
    (
        'u0035',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Rose Brockhouse',
        'rose.brockhouse@gmail.com',
        null,
        null,
        null,
        null,
        0
    ),
    (
        'u0036',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Venita MacGilrewy',
        'venita.macgilrewy@gmail.com',
        null,
        null,
        null,
        null,
        1
    ),
    (
        'u0037',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Perrine Atte-Stone',
        'perrine.atte-stone@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/utkhrxchgmkjsirfmrmp.png',
        '9/25/2023',
        0
    ),
    (
        'u0038',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Wolfie Valencia',
        'wolfie.valencia@gmail.com',
        null,
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/qz4kqwj4f4curejrrc7x.png',
        '12/22/2023',
        0
    ),
    (
        'u0039',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Nadine Vaen',
        'nadine.vaen@gmail.com',
        null,
        'female',
        null,
        null,
        0
    ),
    (
        'u0040',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Ronny Sheavills',
        'ronny.sheavills@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/fdywfgg5usn96yyfy9bf.png',
        '8/16/2024',
        0
    ),
    (
        'u0041',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Georgina Learmouth',
        'georgina.learmouth@gmail.com',
        '6594060661',
        'male',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/utkhrxchgmkjsirfmrmp.png',
        null,
        1
    ),
    (
        'u0042',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Royall Lowensohn',
        'royall.lowensohn@gmail.com',
        '2203317558',
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/l5mfkivokjtwayirww6j.png',
        '10/24/2023',
        1
    ),
    (
        'u0043',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Inessa Roderham',
        'inessa.roderham@gmail.com',
        '1689106393',
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/y1t83x6vwbxazwnmcgke.png',
        null,
        0
    ),
    (
        'u0044',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Rodrigo Spoerl',
        'rodrigo.spoerl@gmail.com',
        null,
        null,
        null,
        null,
        0
    ),
    (
        'u0045',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Koressa Sully',
        'koressa.sully@gmail.com',
        '7248726951',
        'male',
        null,
        null,
        0
    ),
    (
        'u0046',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Brooke De Vuyst',
        'brooke.de.vuyst@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/e8dr5blfidt0ougqayd9.png',
        '7/27/2024',
        0
    ),
    (
        'u0047',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Rene Ruecastle',
        'rene.ruecastle@gmail.com',
        null,
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/l5mfkivokjtwayirww6j.png',
        '2/9/2024',
        1
    ),
    (
        'u0048',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Hana Cleugher',
        'hana.cleugher@gmail.com',
        null,
        null,
        null,
        null,
        0
    ),
    (
        'u0049',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Thomasa Caush',
        'thomasa.caush@gmail.com',
        null,
        null,
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/r74itcqp4mbsrvnozg3o.png',
        '3/7/2024',
        1
    ),
    (
        'u0050',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Vivyanne Guidone',
        'vivyanne.guidone@gmail.com',
        '2479999281',
        'male',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/e8dr5blfidt0ougqayd9.png',
        '1/27/2024',
        0
    ),
    (
        'u0051',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Maryl Dupoy',
        'maryl.dupoy@gmail.com',
        '2544360280',
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/wmwifpgevvpwcb78tvxi.png',
        '12/29/2023',
        0
    ),
    (
        'u0052',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Nessie Potteril',
        'nessie.potteril@gmail.com',
        null,
        null,
        null,
        null,
        0
    ),
    (
        'u0053',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Claus Sacaze',
        'claus.sacaze@gmail.com',
        null,
        'male',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445362/groovo/wmwifpgevvpwcb78tvxi.png',
        '3/3/2024',
        0
    ),
    (
        'u0054',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Lammond Bauldry',
        'lammond.bauldry@gmail.com',
        null,
        'female',
        'https://res.cloudinary.com/dmiaubxsm/image/upload/v1726445361/groovo/l5mfkivokjtwayirww6j.png',
        null,
        1
    ),
    (
        'u0055',
        '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2',
        'user',
        'Matti Kenealy',
        'matti.kenealy@gmail.com',
        null,
        'male',
        null,
        null,
        1
    );

-- Add Artist
insert into
    Artist (id_artist, name, slug, url_cover, is_show)
values
    (
        'a0001',
        'Sơn Tùng MTP',
        "son-tung-mtp",
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401448/f2xmimptoidxl1k8a1zg.jpg',
        true
    ),
    (
        'a0002',
        'Mỹ Tâm',
        "my-tam",
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400292/ptjrn3zzdidsr88790at.jpg',
        true
    ),
    (
        'a0003',
        'Hồ Ngọc Hà',
        "ho-ngoc-ha",
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401476/g4xfzzbxntyn9jcewmch.jpg',
        true
    ),
    (
        'a0004',
        'Noo Phước Thịnh',
        'noo-phuoc-thinh',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401336/zorva8tn2t9jayome2vs.jpg',
        true
    ),
    (
        'a0005',
        'Bích Phương',
        "bich-phuong",
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400792/qgaxfu5i07xoczhdiekj.jpg',
        true
    ),
    (
        'a0006',
        'Erik',
        'erik',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400746/qdjzvkvk4pogcyqzzdwl.jpg',
        true
    ),
    (
        'a0007',
        'Hoàng Thùy Linh',
        'hoang-thuy-linh',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400537/fu3h5geowhjpwmyycjlr.jpg',
        true
    ),
    (
        'a0008',
        'Hương Tràm',
        'huong-tram',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401501/nc7wus6jhjkw1kmqldsh.jpg',
        true
    ),
    (
        'a0009',
        'Đông Nhi',
        'dong-nhi',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400367/qarb5aomgunr0og4hedt.webp',
        true
    ),
    (
        'a0010',
        'Tóc Tiên',
        'toc-tien',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401057/nqrlkvuszpsdlx5n3pwo.jpg',
        true
    ),
    (
        'a0011',
        'Trúc Nhân',
        'truc-nhan',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400367/qarb5aomgunr0og4hedt.webp',
        true
    ),
    (
        'a0012',
        'Phan Mạnh Quỳnh',
        'phan-manh-quynh',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401248/i1wugwfsufuiucolgdny.jpg',
        true
    ),
    (
        'a0013',
        'Thùy Chi',
        'thuy-chi',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400992/ldhtivf1ex36bkwt7gxc.jpg',
        true
    ),
    (
        'a0014',
        'Đức Phúc',
        'duc-phuc',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400579/vlkyw6eox5kwe4qqq75z.jpg',
        true
    ),
    (
        'a0015',
        'Vũ Cát Tường',
        'vu-cat-tuong',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400922/d9ebbbj6ga3fzshm2fw8.jpg',
        true
    ),
    (
        'a0016',
        'Soobin Hoàng Sơn',
        'soobin-hoang-son',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401115/baywp6pb0tlqhcyxppna.jpg',
        true
    ),
    (
        'a0017',
        'Binz',
        'binz',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401210/dc7s3uhgjp9wpol0c7jg.jpg',
        true
    ),
    (
        'a0018',
        'Ngô Kiến Huy',
        'ngo-kien-huy',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401651/ondxd4glcqikaliywytq.webp',
        true
    ),
    (
        'a0019',
        'Hương Giang',
        'huong-giang',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400893/b0qkd5hy1auhtymuw5fo.jpg',
        true
    ),
    (
        'a0020',
        'Bảo Anh',
        'bao-anh',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401544/jarxa5m7fvvpheal6rxv.jpg',
        true
    ),
    (
        'a0021',
        'Văn Mai Hương',
        'van-mai-huong',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400491/hwfxvp7idopukkd9vkpl.jpg',
        true
    ),
    (
        'a0022',
        'Bùi Anh Tuấn',
        'bui-anh-tuan',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400468/k2zasc2wcf8964nhqjfb.jpg',
        true
    ),
    (
        'a0023',
        'Isaac',
        'isaac',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401366/dbp7wshzrae9g0ecgfh7.jpg',
        true
    ),
    (
        'a0024',
        'Lynk Lee',
        'lynk-lee',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401686/czztnx0xhkajevkzy1wg.jpg',
        true
    ),
    (
        'a0025',
        'JustaTee',
        'justatee',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400719/e3fo0lw8zrkxbepce7d2.jpg',
        true
    ),
    (
        'a0026',
        'Khởi My',
        'khoi-my',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401625/iix26tgsrihqpncrn9w7.webp',
        true
    ),
    (
        'a0027',
        'Đen Vâu',
        'den-vau',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401709/vlcaf2g7vak9zxgch1cx.jpg',
        true
    ),
    (
        'a0028',
        'Phương Mỹ Chi',
        'phuong-my-chi',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401133/xfncwacyfb7jhpgi9vzj.jpg',
        true
    ),
    (
        'a0029',
        'Vicky Nhung',
        'vicky-nhung',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400519/ta95nobu4nbcpuctmdsc.jpg',
        true
    ),
    (
        'a0030',
        'Beyoncé',
        'beyonce',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400421/eynidgoqrvosk69ltguq.webp',
        true
    ),
    (
        'a0031',
        'Taylor Swift',
        'taylor-swift',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401029/x2us7g3sozjrvnwud5tm.jpg',
        true
    ),
    (
        'a0032',
        'Ed Sheeran',
        'ed-sheeran',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401750/msxu528ndoaxqomaihd1.jpg',
        true
    ),
    (
        'a0033',
        'Adele',
        'adele',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400404/yt9wruktriizp5umxvcb.jpg',
        true
    ),
    (
        'a0034',
        'Justin Bieber',
        'justin-bieber',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401790/alykgefsvx6vgp7vctx5.webp',
        true
    ),
    (
        'a0035',
        'Ariana Grande',
        'ariana-grande',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401601/kjeawebzmeax1qslhyxd.jpg',
        true
    ),
    (
        'a0036',
        'Billie Eilish',
        'billie eilish',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400333/wuk7338uefz3pp2zzer4.jpg',
        true
    ),
    (
        'a0037',
        'Lady Gaga',
        'lady-gaga',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401764/zylmo5ztk2ur87sgirwz.jpg',
        true
    ),
    (
        'a0038',
        'Bruno Mars',
        'bruno-mars',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401577/wxtfezbtkqaztwpssxku.jpg',
        true
    ),
    (
        'a0039',
        'Katy Perry',
        'katy-perry',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727401192/jhcnhiwflzkkgnolwxg6.jpg',
        true
    ),
    (
        'a0040',
        'Shakira',
        'shakira',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400958/juiqt7q2iyot5eghi2t5.jpg',
        true
    ),
    (
        'a0041',
        'Alan Walker',
        'alan-walker',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727400958/juiqt7q2iyot5eghi2t5.jpg',
        true
    );

-- Add Type
insert into
    Type (id_type, name, slug, is_show)
values
    (
        't0001',
        'V-Pop',
        'v-pop',
        1
    ),
    (
        't0002',
        'Bolero',
        'bolero',
        1
    ),
    (
        't0003',
        'Rap',
        'rap',
        1
    ),
    (
        't0004',
        'EDM',
        'edm',
        0
    ),
    (
        't0005',
        'Rock',
        'rock',
        0
    ),
    (
        't0006',
        'Truyền thống',
        'truyen-thong',
        0
    ),
    (
        't0007',
        'Aucoustic',
        'aucoustic',
        1
    ),
    (
        't0008',
        'R&B',
        'rnb',
        1
    ),
    (
        't0009',
        'pop',
        'pop',
        1
    ),
    (
        't0010',
        'Dân ca',
        'dan-ca',
        1
    ),
    (
        't0011',
        'Khác',
        'khac',
        1
    ),
    (
        't0012',
        'Country',
        'country',
        1
    ),
    (
        't0013',
        'Folk',
        'folk',
        1
    ),
    (
        't0014',
        'Ballad',
        'ballad',
        1
    ),
    (
        't0015',
        'Soul',
        'soul',
        1
    ),
    (
        't0016',
        'Electronic',
        'electronic',
        1
    );

-- Add Music
-- Sơn tùng MTP
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0001',
        'Em của ngày hôm qua',
        'em-cua-ngay-hom-qua',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431913/nt1ptm3xf8lpfhljngpn.webm',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430691/uhklis6zlvwdkxkzunv5.jpg',
        null,
        'Long Halo',
        'Sơn Tùng MTP',
        1
    ),
    (
        'm0002',
        'Chắc ai đó sẽ về',
        'chac-ai-do-se-ve',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431478/rpmqyciepjvsuwjesfky.mp3',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430608/fy9iie84ei9sybtk8mxu.jpg',
        null,
        'Nguyễn Hà',
        'Sơn Tùng MTP',
        1
    ),
    (
        'm0003',
        'Không phải dạng vừa đâu',
        'khong-phai-dang-vua-dau',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431624/llkm5v1bhdtxdrww4bpc.mp4',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430716/btaojl8ocwi3kgeltyjc.jpg',
        null,
        'SlimV',
        'Sơn Tùng MTP',
        1
    ),
    (
        'm0004',
        'Âm thầm bên em',
        'am-tham-ben-em',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431433/eh85nupsxzs6yye39twq.mp3',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430574/nv4jvs1nxolq1y4beijx.jpg',
        null,
        'SlimV',
        'Sơn Tùng MTP',
        1
    ),
    (
        'm0005',
        'Chúng ta không thuộc về nhau',
        'chung-ta-khong-thuoc-ve-nhau',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431545/tcjn5xnbwhwo0degil13.mp4',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430666/gcnqhe8ez8z3kvp6j0kd.jpg',
        null,
        'Triple D',
        'Sơn Tùng MTP',
        1
    ),
    (
        'm0006',
        'Lạc trôi',
        'lac-troi',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431817/mnriqsdarjeas9isj5wd.webm',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430741/jzxoogccndvmrqyaduqo.jpg',
        null,
        'Triple D, Masew',
        'Sơn Tùng MTP',
        1
    ),
    (
        'm0007',
        'Nơi này có anh',
        'noi-nay-co-anh',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431686/idwz5xiq1evzxa2jxhpe.mp4',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430767/m1aaiz2kyvadwz7hgsof.jpg',
        null,
        'Khắc Hưng',
        'Sơn Tùng MTP',
        1
    ),
    (
        'm0008',
        'Chạy ngay đi',
        'chay-ngay-di',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727431511/ubkei3l2qjd1kdfmaqlz.mp3',
        'http://res.cloudinary.com/dmiaubxsm/image/upload/v1727430645/kypexv2qzdwyj84jhpm6.jpg',
        null,
        'Onionn',
        'Sơn Tùng MTP',
        1
    );

-- 
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0001', 'm0001'),
    ('a0001', 'm0002'),
    ('a0001', 'm0003'),
    ('a0001', 'm0004'),
    ('a0001', 'm0005'),
    ('a0001', 'm0006'),
    ('a0001', 'm0007'),
    ('a0001', 'm0008');

-- 
insert into MusicTypeDetail (id_music, id_type)
values
    -- Em của ngày hôm qua (V-Pop)
    -- ('m0001', 't0001'),
    
    -- Chắc ai đó sẽ về (V-Pop)
    ('m0002', 't0003'),
    ('m0002', 't0001'),
    
    -- Không phải dạng vừa đâu (Rap)
    ('m0003', 't0003'),
    
    -- Âm thầm bên em (V-Pop)
    ('m0004', 't0001'),
    
    -- Chúng ta không thuộc về nhau (V-Pop)
    ('m0005', 't0001'),
    
    -- Lạc trôi (Rap, V-Pop)
    ('m0006', 't0003'),
    ('m0006', 't0001'),
    
    -- Nơi này có anh (V-Pop)
    ('m0007', 't0001'),
    
    -- Chạy ngay đi (Rap, V-Pop)
    ('m0008', 't0003'),
    ('m0008', 't0001');

-- Mỹ Tâm
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0009',
        'Hẹn ước từ hư vô',
        'hen-uoc-tu-hu-vo',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727492933/ctt35bgevef1np7ze0yl.mp3',
        'cover',
        null,
        'My Entertainment',
        'Phan Mạnh Quỳnh',
        1
    ),
    (
        'm0010',
        'Như một giấc mơ',
        'nhu-mot-giac-mo',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727493052/szjc60mztifispank0ty.mp3',
        'cover',
        null,
        'My Entertainment',
        null,
        1
    ),
    (
        'm0011',
        'Người hãy quên em đi',
        'nguoi-hay-quen-em-di',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727493364/ujo5fssyyxl3dy11sugq.mp3',
        'cover',
        null,
        'Khắc Hưng',
        null,
        1
    ),
    (
        'm0012',
        'Niềm tin chiến thắng',
        'niem-tin-chien-thang',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727493394/ok1mkd6qciv8ryhsjtxq.mp3',
        'cover',
        null,
        null,
        'Nhạc sĩ Lê Quang',
        1
    ),
    (
        'm0013',
        'Ước gì',
        'uoc-gi',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727493084/lglt757r6cxniuv9tujx.mp3',
        'cover',
        null,
        null,
        'Nhạc sĩ Võ Thiện Thanh',
        1
    ),
    (
        'm0014',
        'Cây đàn sinh viên',
        'cay-dan-sinh-vien',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727493020/n8xiaev3fddnlz2zk5zw.mp3',
        'cover',
        null,
        null,
        'Nhạc sĩ Quốc An',
        1
    ),
    (
        'm0015',
        'Cứ vui lên',
        'cu-vui-len',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727493159/fiu6z95hr2gse7kfxfil.mp3',
        'cover',
        null,
        null,
        'Trịnh Bảo Bàng',
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0002', 'm0009'),
    ('a0002', 'm0010'),
    ('a0002', 'm0011'),
    ('a0002', 'm0012'),
    ('a0002', 'm0013'),
    ('a0002', 'm0014'),
    ('a0002', 'm0015');

--
insert into MusicTypeDetail (id_music, id_type)
values
    -- Hẹn ước từ hư vô (V-Pop)
    ('m0009', 't0001'),
    
    -- Như một giấc mơ (Ballad)
    ('m0010', 't0002'),
    
    -- Người hãy quên em đi (V-Pop)
    ('m0011', 't0001'),
    
    -- Niềm tin chiến thắng (Pop Rock)
    ('m0012', 't0005'),
    
    -- Ước gì (Ballad)
    ('m0013', 't0002'),
    
    -- Cây đàn sinh viên (Pop Rock)
    ('m0014', 't0005'),
    
    -- Cứ vui lên (V-Pop)
    ('m0015', 't0001');

-- Bích Phương
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0016',
        'Bùa yêu',
        'bua-yeu',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727575241/venmkmzf8q6bcupp8wwc.mp3',
        'https://i1.sndcdn.com/artworks-000350133636-mil48l-t500x500.jpg',
        null,
        null,
        'Tiên Cookie, Phạm Thanh Hà, DươngK',
        1
    ),
    (
        'm0017',
        'Đi đu đưa đi',
        'di-du-dua-di',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727575256/zycvzm0ujeewkfjw2hr2.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ieTDrsIz1nRnTUxWVy_TaLen6lHjN2t0Ig&s',
        null,
        null,
        'Tiên Cookie, Phạm Thanh Hà',
        1
    ),
    (
        'm0018',
        'Một cú lừa',
        'mot-cu-lua',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727575269/aycgjpsqwhp8g75ogzht.mp3',
        'https://avatar-ex-swe.nixcdn.com/song/share/2020/05/31/0/e/7/e/1590919525767.jpg',
        null,
        null,
        'Tiên Cookie',
        1
    ),
    (
        'm0019',
        'Từ chối nhẹ nhàng thôi',
        'tu-choi-nhe-nhang-thoi',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727575315/vousfrp4qhctqwonfpp0.mp3',
        'https://i.ytimg.com/vi/h23OBd1VZsg/maxresdefault.jpg',
        null,
        null,
        'Tiên Cookie',
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0005', 'm0016'),
    ('a0005', 'm0017'),
    ('a0005', 'm0018'),
    ('a0005', 'm0019');

--
insert into MusicTypeDetail (id_music, id_type)
values
    -- Bùa yêu (V-Pop)
    ('m0016', 't0001'),
    
    -- Đi đu đưa đi (EDM)
    ('m0017', 't0004'),
    
    -- Một cú lừa (V-Pop)
    ('m0018', 't0001'),
    
    -- Từ chối nhẹ nhàng thôi (V-Pop)
    ('m0019', 't0001');

-- Trúc Nhân
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0020',
        'Có không giữ mất đừng tìm',
        'co-khong-giu-mat-dung-tim',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572254/ub965yum6scuarkzvd6z.mp3',
        'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/0/3/9/7/0397842eb359d014b1928c3a7ff7d548.jpg',
        null,
        'TDK, Minh Hoàng, Long X, Nguyễn Hải Phong',
        'Bùi Công Nam',
        1
    ),
    (
        'm0021',
        'Vẽ',
        've-truc-nhan',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572381/by19zhmwwuvyt1mpabmp.mp3',
        'https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/covers/c/2/c270eb7dd0e8b6b2e46e7b8efb3a1362_1417392544.jpg',
        null,
        'Khắc Hưng',
        'Nguyễn Thúc Thùy Tiên',
        1
    ),
    (
        'm0022',
        'Sáng mắt chưa',
        'sang-mat-chua',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572340/iuiowuyficpoktrul2n7.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR67QorbrNlM-3Y6qakPEMB99IC8qoeCvD0xQ&s',
        null,
        'Nguyễn Hải Phong',
        'Mew Amzing',
        1
    ),
    (
        'm0023',
        'Lớn rồi còn khóc nhè',
        'lon-roi-con-khoc-nhe',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572281/ugukwlrcgusdggcuvtzx.mp3',
        'https://i1.sndcdn.com/artworks-000541716087-rp4kxc-t500x500.jpg',
        null,
        null,
        'Nguyễn Hải Phong',
        1
    ),
    (
        'm0024',
        'Bốn chữ lắm',
        'bon-chu-lam',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572228/yfhlnr7sa3wbqvipk6md.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSenuDJJVjd_QWhnpM4TX7U8f5Wm73w5dt0XA&s',
        null,
        null,
        'Phạm Toàn Thắng & Nguyễn Duy Anh',
        1
    ),
    (
        'm0025',
        'Thật bất ngờ',
        'that-bat-ngo',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572360/m0em11acbbcuu08btg3t.mp3',
        'https://i.ytimg.com/vi/hlGSgR8sljw/maxresdefault.jpg',
        null,
        null,
        'Mew Amazing, Dương Khắc Linh & Cao Bá Hưng',
        1
    ),
    (
        'm0026',
        'Ngồi hát đớ buồn',
        'ngoi-hat-do-buon',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572313/qwsnkm4pfc3lsh3zi3cs.mp3',
        'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/8/d/8d0e9de9056dc4f3a6aac5f3dfad1b8d_1499396093.jpg',
        null,
        null,
        'Nguyễn Hải Phong',
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0011', 'm0020'),
    ('a0011', 'm0021'),
    ('a0011', 'm0022'),
    ('a0011', 'm0023'),
    ('a0011', 'm0024'),
    ('a0011', 'm0025'),
    ('a0011', 'm0026');

-- Phan Mạnh Quỳnh
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0027',
        'Sau lời từ khước',
        'sau-loi-tu-khuoc',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572578/p92ue4cy9xs5qkj30cun.mp3',
        'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/e/d/0/7/ed0741228ad36870e13624120474e50a.jpg',
        null,
        'Warner Music Vietnam',
        'Phan Mạnh Quỳnh',
        1
    ),
    (
        'm0028',
        'Có chàng trai viết lên cây',
        'co-chang-trai-viet-len-cay',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572430/xgw7vauul8u04ynaz79l.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Bd82r4DcyeudeQ_030LXf-nwZi0NiueNPw&s',
        null,
        'Future Da Producer',
        'Phan Mạnh Quỳnh',
        1
    ),
    (
        'm0029',
        'Chuyến xe',
        'chuyen-xe',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572411/up8y1nwnmq7l2otdjezp.mp3',
        'https://i.ytimg.com/vi/uM6UAXLa3ck/maxresdefault.jpg',
        null,
        null,
        'Phan Mạnh Quỳnh',
        1
    ),
    (
        'm0030',
        'Nước ngoài',
        'nuoc-ngoai',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572548/fnvczzn3ybqdzye4psku.mp3',
        'https://i.ytimg.com/vi/_j3LFYBBXY0/maxresdefault.jpg',
        null,
        null,
        'Phan Mạnh Quỳnh',
        1
    ),
    (
        'm0031',
        'Từ đó',
        'tu-do',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572600/mm6xxdmcr6b0cqfoivtd.mp3',
        'https://i.ytimg.com/vi/HsgTIMDA6ps/maxresdefault.jpg',
        null,
        null,
        'Phan Mạnh Quỳnh',
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0012', 'm0027'),
    ('a0012', 'm0028'),
    ('a0012', 'm0029'),
    ('a0012', 'm0030'),
    ('a0012', 'm0031');

--
insert into MusicTypeDetail (id_music, id_type)
values
    -- Sau lời từ khước (Ballad)
    ('m0027', 't0014'),
    
    -- Có chàng trai viết lên cây (Ballad)
    ('m0028', 't0014'),
    
    -- Chuyến xe (Ballad)
    ('m0029', 't0014'),
    
    -- Nước ngoài (Pop/Ballad)
    ('m0030', 't0014'),
    ('m0030', 't0001'),
    
    -- Từ đó (Ballad)
    ('m0031', 't0014');

-- Đen Vâu
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0032',
        'Hai triệu năm',
        'hai-trieu-nam',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572645/pkqjuswdlil20pkmb1mo.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtTScq3FxtIEEHbKuJk1LmimRaiTs_xIkTWw&s',
        null,
        null,
        'Đen Vâu',
        1
    ),
    (
        'm0033',
        'Mười năm',
        'muoi-nam',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572733/d1vxfmxnv8aqf3gany9n.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSEAIEXIDsTk6vn_wlDXfyitq6bpjAJo2c5g&s',
        null,
        null,
        'Đen Vâu',
        1
    ),
    (
        'm0034',
        'Mang tiền về cho mẹ',
        'mang-tien-ve-cho-me',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572498/z8ua5jc5ut26zufsvmv8.mp3',
        'https://image.sggp.org.vn/w1000/Uploaded/2024/evofjasfzyr/2022_01_17/1-den-vau_KELX.jpg.webp',
        null,
        null,
        'Đen Vâu',
        1
    ),
    (
        'm0035',
        'Đi về nhà',
        'di-ve-nha',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572455/oy6wahzpxhuukfpkfmlj.mp3',
        'https://i.ytimg.com/vi/Eb7NLJwejoU/maxresdefault.jpg',
        null,
        null,
        'Đen Vâu',
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0027', 'm0032'),
    ('a0027', 'm0033'),
    ('a0027', 'm0034'),
    ('a0027', 'm0035');

--
insert into MusicTypeDetail (id_music, id_type)
values
    -- Hai triệu năm (Rap)
    ('m0032', 't0003'),
    
    -- Mười năm (Rap)
    ('m0033', 't0003'),
    
    -- Mang tiền về cho mẹ (Rap)
    ('m0034', 't0003'),
    
    -- Đi về nhà (Rap)
    ('m0035', 't0003');

-- Phương Mỹ Chi
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0036',
        'Bóng Phù Hoa',
        'bong-phu-hoa',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572759/ljozjythwgclgknngdpb.mp3',
        'https://i.ytimg.com/vi/jhln5b4wOfI/maxresdefault.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0037',
        'Những ngôi sao xa xôi',
        'nhung-ngoi-sao-xa-xoi',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572810/na9iesbcesybkxmsiovx.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1JsheXVm35xqs_0nTDufhwukYn6Z6H18rBw&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0038',
        'Chiếc áo bà ba',
        'chiec-ao-ba-ba',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572788/q4wsj67yctncgcfna1zr.mp3',
        'https://i.ytimg.com/vi/odrMPD2mxWs/maxresdefault.jpg',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0028', 'm0036'),
    ('a0028', 'm0037'),
    ('a0028', 'm0038');

insert into MusicTypeDetail (id_music, id_type)
values
    -- Bóng Phù Hoa (Dân ca)
    ('m0036', 't0010'),
    
    -- Những ngôi sao xa xôi (Dân ca)
    ('m0037', 't0010'),
    
    -- Chiếc áo bà ba (Dân ca)
    ('m0038', 't0010');

-- Vicky Nhung
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0039',
        'Việt nam những chuyến đi',
        'viet-nam-nhung-chuyen-di',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572872/nybt34lzaexoewznbqax.mp3',
        'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/c/1/0/9/c10933c1432673fd0db936d200afbb29.jpg',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0029', 'm0039');

--
insert into MusicTypeDetail (id_music, id_type)
values
    -- Việt nam những chuyến đi (Thể loại khác)
    ('m0039', 't0011');

-- Beyonce
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0040',
        'Halo',
        'halo',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572883/fy0bqznwj81xnqaup7rw.mp3',
        'https://upload.wikimedia.org/wikipedia/en/a/ac/Beyonce_-_Halo.png',
        null,
        null,
        null,
        1
    ),
    (
        'm0041',
        'Run the world',
        'run-the-world',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572932/gnytqjgkgqac5fyqcyrb.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReamHBvuwJA3F8K_dRThIEFSEu7LgSNLMafg&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0042',
        'If I were a boy',
        'if-i-were-a-boy',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572914/zzklss1ggcogypwaikcf.mp3',
        'https://upload.wikimedia.org/wikipedia/en/4/4b/Beyonce_-_If_I_Were_a_Boy_%28single%29.png',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0030', 'm0040'),  -- Halo
    ('a0030', 'm0041'),  -- Run the world
    ('a0030', 'm0042');  -- If I were a boy

--
insert into MusicTypeDetail (id_music, id_type)
values
    ('m0040', 't0009'),   -- Halo
    ('m0041', 't0009'),   -- Run the world
    ('m0042', 't0009');   -- If I were a boy

-- Taylor Swift
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0043',
        'Love story',
        'love-story',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572982/v2gvwlyn0z9djy5oxcww.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStlVwv0kJme5AnfPm8JxDKdTkfUSQcV6WShA&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0044',
        'Look what you you made me do',
        'look-what-you-made-me-do',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727572960/j0gqhgiyn3cbar12x9ds.mp3',
        'https://upload.wikimedia.org/wikipedia/vi/f/fd/LWYMMD_Official_single_cover.jpg',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0031', 'm0043'),  -- Love story
    ('a0031', 'm0044');  -- Look what you made me do

--
insert into MusicTypeDetail (id_music, id_type)
values
    ('m0043', 't0012'),  -- Love story
    ('m0044', 't0009');      -- Look what you made me do

-- Ed Sheeran
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0045',
        'The A Team',
        'the-a-team',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573182/dw1doseiybl82ytdj7vd.mp3',
        'https://upload.wikimedia.org/wikipedia/en/6/60/Ed_Sheeran_-_The_A_Team.png',
        null,
        null,
        null,
        1
    ),
    (
        'm0046',
        'Lego house',
        'lego-house',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573094/mmgqrt1imfcfmizldjoc.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKJTajcZ6RfjuNHuGISvY9pn_YepIqriTiw&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0047',
        'Shape of you',
        'shape-of-you',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573107/vwmxcjfoenof2ylw0tsw.mp3',
        'https://i.ytimg.com/vi/JGwWNGJdvx8/sddefault.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0048',
        'Castle on the hill',
        'castle-on-the-hill',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573018/dms1muhmfbftppcimnl4.mp3',
        'https://m.media-amazon.com/images/M/MV5BNGE2OTdlNjktYzIzZC00YzNiLWJjMjUtMjIwNDlhMDAzZmFjXkEyXkFqcGc@._V1_.jpg',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0032', 'm0045'),  -- The A Team
    ('a0032', 'm0046'),  -- Lego House
    ('a0032', 'm0047'),  -- Shape of You
    ('a0032', 'm0048');  -- Castle on the Hill

insert into MusicTypeDetail (id_music, id_type)
values
    ('m0045', 't0013'),   -- The A Team
    ('m0046', 't0013'),   -- Lego House
    ('m0047', 't0009'),    -- Shape of You
    ('m0048', 't0005');   -- Castle on the Hill

-- Adele
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0049',
        'Someone like you',
        'someone-like-you',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573132/jplghw7m3zgoge7nffbv.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMEFPcTxQe2UHfvABcSptaYhhrMc_lEyp2qg&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0050',
        'Hello',
        'hello',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573032/lwrkar899te6bivoaad5.mp3',
        'https://m.media-amazon.com/images/M/MV5BNTc4ODVkMmMtZWY3NS00OWI4LWE1YmYtN2NkNDA3ZjcyNTkxXkEyXkFqcGc@._V1_.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0051',
        'Rolling in the deep',
        'rolling-in-the-deep',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573205/bvymardefnft8yr2wuol.mp3',
        'https://upload.wikimedia.org/wikipedia/en/7/74/Adele_-_Rolling_in_the_Deep.png',
        null,
        null,
        null,
        1
    ),
    (
        'm0052',
        'Set fire to the rain',
        'set-fire-to-the-rain',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573227/blubyoxy5cky4udjtezt.mp3',
        'https://i1.sndcdn.com/artworks-8ULFu6bD4KrQITve-ZxopmQ-t500x500.jpg',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0033', 'm0049'),  -- Someone like you
    ('a0033', 'm0050'),  -- Hello
    ('a0033', 'm0051'),  -- Rolling in the deep
    ('a0033', 'm0052');  -- Set fire to the rain

--
insert into MusicTypeDetail (id_music, id_type)
values
    ('m0049', 't0014'),    -- Someone like you
    ('m0050', 't0015'),      -- Hello
    ('m0051', 't0015'),      -- Rolling in the deep
    ('m0052', 't0009');       -- Set fire to the rain

-- Justin Bieber
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0053',
        'Stay',
        'stay',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573348/czw9xfuqrdfk44mryofa.mp3',
        'https://i1.sndcdn.com/artworks-NTWumskIAtzxndKO-yz1ryA-t500x500.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0054',
        'Baby',
        'baby',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573256/lkgpebnc4cgoqvbj1q1j.mp3',
        'https://upload.wikimedia.org/wikipedia/vi/d/d1/Babycoverart.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0055',
        'Onetime',
        'onetime',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573318/sxtczsoej2xgxi2ynan2.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScHXTs6zj4mheKgXoKtFZbGxGTS2vmegVCDQ&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0056',
        'Love me',
        'love-me',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573280/nidpbqzitsxfdhluv4ks.mp3',
        'https://i.scdn.co/image/ab67616d0000b2737c3bb9f74a98f60bdda6c9a7',
        null,
        null,
        null,
        1
    ),
    (
        'm0057',
        'Mood',
        'mood',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573309/uzt9yc2wpy4xpiiwrzws.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThtSUy9UFmBYq9B_dqWisgE-snyMnqfeAA1g&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0058',
        'Sorry',
        'sorry',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573332/enct9j5fl2ngc78vmsxm.mp3',
        'https://upload.wikimedia.org/wikipedia/en/d/dc/Justin_Bieber_-_Sorry_%28Official_Single_Cover%29.png',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0034', 'm0053'),  -- Stay
    ('a0034', 'm0054'),  -- Baby
    ('a0034', 'm0055'),  -- Onetime
    ('a0034', 'm0056'),  -- Love me
    ('a0034', 'm0057'),  -- Mood
    ('a0034', 'm0058');  -- Sorry

--
insert into MusicTypeDetail (id_music, id_type)
values
    ('m0053', 't0009'),        -- Stay
    ('m0054', 't0009'),        -- Baby
    ('m0055', 't0009'),        -- Onetime
    ('m0056', 't0009'),        -- Love me
    ('m0057', 't0009'),        -- Mood
    ('m0058', 't0009');        -- Sorry

-- Katy Perry
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0059',
        'Roar',
        'roar',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573419/lew1eftwp99tcdn817b0.mp3',
        'https://i.ytimg.com/vi/CevxZvSJLk8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLACmGBvA_4JDjhAvcm88duJUJZBFw',
        null,
        null,
        null,
        1
    ),
    (
        'm0060',
        'Dark horse',
        'dark-horse',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573376/ugjoi8pjnvrh48yfoerk.mp3',
        'https://static.independent.co.uk/s3fs-public/thumbnails/image/2014/02/26/10/katy-perry-dark-horse-v2.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0061',
        'Hot N Cold',
        'hot-n-cold',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573408/q496shibxfo583y4yepb.mp3',
        'https://upload.wikimedia.org/wikipedia/vi/a/ab/Katy_Perry_Hot_N_Cold.jpg',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0039', 'm0059'),  -- Roar
    ('a0039', 'm0060'),  -- Dark horse
    ('a0039', 'm0061');  -- Hot N Cold

--
insert into MusicTypeDetail (id_music, id_type)
values
    ('m0059', 't0009'),        -- Roar
    ('m0060', 't0009'),        -- Dark horse
    ('m0061', 't0009');        -- Hot N Cold

-- Alan Walker
insert into
    Music (
        id_music,
        name,
        slug,
        url_path,
        url_cover,
        total_duration,
        producer,
        composer,
        is_show
    )
values
    (
        'm0062',
        'Faded',
        'faded',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573542/iqpa4fauvwcrilx2kp9v.mp3',
        'https://i.ytimg.com/vi/pasha7KJ6_o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBggqWZEe0s69iUEBjwnQXwBaWI7Q',
        null,
        null,
        null,
        1
    ),
    (
        'm0063',
        'All I want for chrismas',
        'all-i-want-for-chrismas',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573586/ovycqdevikvjcx4nlprc.mp3',
        'https://i.ytimg.com/vi/Yd_uia5us-c/maxresdefault.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0064',
        'Lonely',
        'lonely',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573626/tluxgzjesnsx0zq3vmg5.mp3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk619y4eeOacxQVANaQvKItYhWkTTgRx5S8Q&s',
        null,
        null,
        null,
        1
    ),
    (
        'm0065',
        'What do you mean',
        'what-do-you-mean',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573650/whdbpppaazzwqmdzlm4y.mp3',
        'https://helios-i.mashable.com/imagery/articles/031nHILV3WVKY9J9zJSxbyF/hero-image.fill.size_1200x900.v1611607646.jpg',
        null,
        null,
        null,
        1
    ),
    (
        'm0066',
        'Stay',
        'stay-alan-walker',
        'http://res.cloudinary.com/dmiaubxsm/video/upload/v1727573687/xyhmlf1hca3ubyseaim4.mp3',
        'https://i1.sndcdn.com/artworks-y7nXhwuaVIot4FOl-Z8LivA-t500x500.jpg',
        null,
        null,
        null,
        1
    );

--
insert into MusicArtistDetail (id_artist, id_music)
values
    ('a0041', 'm0062'),  -- Faded
    ('a0041', 'm0063'),  -- All I want for Christmas
    ('a0041', 'm0064'),  -- Lonely
    ('a0041', 'm0065'),  -- What do you mean
    ('a0041', 'm0066');  -- Stay

--
insert into MusicTypeDetail (id_music, id_type)
values
    ('m0062', 't0016'),  -- Faded
    ('m0063', 't0009'),          -- All I want for Christmas
    ('m0064', 't0009'),          -- Lonely
    ('m0065', 't0009'),          -- What do you mean
    ('m0066', 't0009');          -- Stay

-- Add album    
INSERT INTO Album (id_album, name, slug, url_cover, id_artist)
VALUES
    ('al0001', 'M-TP Ambition', 'mtp-ambition', 'https://i1.sndcdn.com/artworks-000157846189-57coq1-t500x500.jpg', 'a0001'),
    ('al0002', 'Tâm 9', 'tam-9', 'https://upload.wikimedia.org/wikipedia/vi/f/f5/Tam9mytam.jpeg', 'a0002'),
    ('al0003', 'V', 'v-album', 'https://i.pinimg.com/originals/4a/b4/b2/4ab4b286b798109963ca6daa77ada53e.jpg', 'a0032'),
    ('al0004', '25', '25-album', 'https://i.scdn.co/image/ab67616d0000b27347ce408fb4926d69da6713c2', 'a0033'),
    ('al0005', 'Purpose', 'purpose', 'https://images.genius.com/cff977262de4bf712a530580d27c7412.1000x1000x1.jpg', 'a0034');

-- Add MusicAlbum
INSERT INTO MusicAlbumDetail (id_music, id_album)
VALUES
    -- Album "M-TP Ambition"
    ('m0001', 'al0001'), -- Lạc Trôi
    ('m0002', 'al0001'), -- Chạy Ngay Đi
    ('m0003', 'al0001'), -- Nơi Này Có Anh
    ('m0004', 'al0001'), -- Hãy Trao Cho Anh

    -- Album "Tâm 9"
    ('m0005', 'al0002'), -- Đừng Hỏi Em
    ('m0006', 'al0002'), -- Muộn Màng Là Từ Lúc
    ('m0007', 'al0002'), -- Người Hãy Quên Em Đi
    ('m0008', 'al0002'), -- Cô Ấy Là Ai?

    -- Album "V"
    ('m0009', 'al0003'), -- Shape of You
    ('m0010', 'al0003'), -- Perfect
    ('m0011', 'al0003'), -- Castle on the Hill
    ('m0012', 'al0003'), -- Galway Girl

    -- Album "25"
    ('m0013', 'al0004'), -- Hello
    ('m0014', 'al0004'), -- Send My Love (To Your New Lover)
    ('m0015', 'al0004'), -- When We Were Young
    ('m0016', 'al0004'), -- Water Under the Bridge

    -- Album "Purpose"
    ('m0017', 'al0005'), -- Sorry
    ('m0018', 'al0005'), -- Love Yourself
    ('m0019', 'al0005'), -- What Do You Mean?
    ('m0020', 'al0005'); -- Company

-- Lyrics
INSERT INTO Lyrics (id_music, lyrics, start_time, end_time)
VALUES
    ('m0001', 'Yeah, yeah, yeah', 0, 4),
    ('m0001', 'Em đang nơi nào?', 5, 9),
    ('m0001', '(Can you tell me?) Nơi nào? Nơi nào?', 10, 14),
    ('m0001', '(Can you tell me?) Nơi nào? Nơi nào?', 15, 19),
    ('m0001', 'Yeah, yeah, yeah (MTP)', 20, 24),
    ('m0001', 'Liệu rằng chia tay trong em có quên được câu ca?', 25, 30),
    ('m0001', 'Tình yêu khi xưa em trao cho anh đâu nào phôi pha', 31, 36),
    ('m0001', 'Đừng lừa dối con tim anh, em sẽ không buông tay anh được đâu mà (em không thể buông)', 37, 43),
    ('m0001', 'Gạt nước mắt, yếu đuối đó cứ quay lại nơi anh', 44, 49),
    ('m0001', 'Em biết rằng cơn mưa qua đâu có che lấp được nụ cười đau thương kia', 50, 57),
    ('m0001', 'Nước mắt đó vẫn rơi vì em, oh baby, no baby', 58, 63),
    ('m0001', 'Đừng nhìn anh nữa, đôi mắt ngày xưa giờ ở đâu, em còn là em?', 64, 70),
    ('m0001', 'Em đã khác rồi, em muốn quay lưng, quên hết đi (thật vậy sao?)', 71, 76),
    ('m0001', 'Tình yêu trong em giờ toàn giả dối, anh không muốn vùi mình trong mơ', 77, 83),
    ('m0001', 'Anh không muốn đi tìm giấc mơ ngày hôm nao', 84, 89),
    ('m0001', 'Đừng vội vàng, em hãy là em của ngày hôm qua, ooh-ooh-ooh-ooh', 90, 97),
    ('m0001', 'Xin hãy là em của ngày hôm qua, ooh-ooh-ooh-ooh', 98, 103),
    ('m0001', 'Đừng bỏ mặc anh một mình nơi đây, ooh-ooh-ooh-ooh', 104, 110),
    ('m0001', 'Dừng lại và xoá nhẹ đi kí ức, ooh-ooh-ooh-ooh', 111, 117);

insert into Follow (id_user, id_artist) values
    ("u0001", "a0001"),
    ("u0001", "a0002"),
    ("u0001", "a0003"),
    ("u0001", "a0004"),
    ("u0001", "a0005"),
    ("u0006", "a0007"),
    ("u0006", "a0008"),
    ("u0006", "a0009"),
    ("u0006", "a0010"),
    ("u0002", "a0005"),
    ("u0003", "a0006"),
    ("u0004", "a0006"),
    ("u0005", "a0006"),
    ("u0006", "a0006");

insert into MusicHistory (id_user, id_music, play_duration) values
    ("u0001", "m0001", 12),
    ("u0001", "m0002", 12),
    ("u0001", "m0003", 12),
    ("u0001", "m0004", 12),
    ("u0001", "m0005", 12),
    ("u0006", "m0007", 12),
    ("u0006", "m0008", 12),
    ("u0006", "m0009", 12),
    ("u0006", "m0010", 12),
    ("u0002", "m0005", 12),
    ("u0003", "m0006", 12),
    ("u0004", "m0006", 12),
    ("u0005", "m0006", 12),
    ("u0006", "m0006", 12);

insert into FavoriteAlbum (id_user, id_album) values
    ("u0001", "al0001"),
    ("u0001", "al0002"),
    ("u0001", "al0003"),
    ("u0006", "al0001"),
    ("u0006", "al0002"),
    ("u0006", "al0003");

insert into FavoriteMusic (id_user, id_music) values
    ("u0001", "m0001"),
    ("u0001", "m0002"),
    ("u0001", "m0003"),
    ("u0006", "m0001"),
    ("u0006", "m0002"),
    ("u0006", "m0003");

insert into Playlist (id_playlist, id_user, name, playlist_index) values
("p0001", "u0001", "Play list 1", 0),
("p0002", "u0001", "Play list 2", 1),
("p0003", "u0001", "Play list 3", 2),
("p0004", "u0006", "Play list 4", 0),
("p0005", "u0006", "Play list 5", 1),
("p0006", "u0005", "Play list 1", 0),
("p0007", "u0005", "Play list 2", 1),
("p0008", "u0005", "Play list 3", 2),
("p0009", "u0005", "Play list 4", 0),
("p0010", "u0005", "Play list 5", 1);

insert into MusicPlaylistDetail (id_playlist, id_music) values
("p0001", "m0001"),
("p0001", "m0002"),
("p0001", "m0003"),
("p0001", "m0004"),
("p0001", "m0005"),
("p0001", "m0006"),
("p0002", "m0007"),
("p0002", "m0002"),
("p0002", "m0003"),
("p0002", "m0004"),
("p0002", "m0005"),
("p0002", "m0006"),
("p0003", "m0001"),
("p0003", "m0002"),
("p0003", "m0003"),
("p0003", "m0007"),
("p0003", "m0005"),
("p0003", "m0006"),
("p0004", "m0001"),
("p0004", "m0002"),
("p0004", "m0003"),
("p0004", "m0007"),
("p0004", "m0005"),
("p0004", "m0006"),
("p0005", "m0001"),
("p0005", "m0002"),
("p0005", "m0008"),
("p0005", "m0004"),
("p0005", "m0005"),
("p0005", "m0006");