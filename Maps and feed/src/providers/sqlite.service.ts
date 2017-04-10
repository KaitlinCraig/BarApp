import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

import { IBar, IReview, IUser } from '../interfaces';
import { ItemsService } from '../providers/items.service';

@Injectable()
export class SqliteService {
    db: SQLite;

    constructor(private itemsService: ItemsService) {

    }

    InitDatabase() {
        var self = this;
        this.db = new SQLite();
        self.db.openDatabase({
            name: 'forumdb.db',
            location: 'default' // the location field is required
        }).then(() => {
            self.createBars();
            self.createReviews();
            self.createUsers();
        }, (err) => {
            console.error('Unable to open database: ', err);
        });
    }

    resetDatabase() {
        var self = this;
        self.resetUsers();
        self.resetBars();
        self.resetReviews();
    }

    resetUsers() {
        var self = this;
        let query = 'DELETE FROM Users';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Users removed');
        }, (err) => {
            console.error('Unable to remove users: ', err);
        });
    }

    resetBars() {
        var self = this;
        let query = 'DELETE FROM Bars';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Bars removed');
        }, (err) => {
            console.error('Unable to remove Bars: ', err);
        });
    }

    resetReviews() {
        var self = this;
        let query = 'DELETE FROM Reviews';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Reviews removed');
        }, (err) => {
            console.error('Unable to remove Reviews: ', err);
        });
    }

    printBars() {
        var self = this;
        self.db.executeSql('SELECT * FROM Bars', {}).then((data) => {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    console.log(data.rows.item(i));
                    console.log(data.rows.item(i).key);
                    console.log(data.rows.item(i).title);
                    console.log(data.rows.item(i).question);
                }
            } else {
                console.log('no bars found..');
            }
        }, (err) => {
            console.error('Unable to print bars: ', err);
        });
    }

    createBars() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Bars ( key VARCHAR(255) PRIMARY KEY NOT NULL, title text NOT NULL, question text NOT NULL, category text NOT NULL, musicCategory text NOT NULL, hotness text NOT NULL, datecreated text, USER VARCHAR(255), reviews INT NULL);', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Bars table: ', err);
        });
    }

    createReviews() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Reviews ( key VARCHAR(255) PRIMARY KEY NOT NULL, bar VARCHAR(255) NOT NULL, text text NOT NULL, USER VARCHAR(255) NOT NULL, datecreated text, votesUp INT NULL, votesDown INT NULL);', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Reviews table: ', err);
        });
    }

    createUsers() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Users ( uid text PRIMARY KEY NOT NULL, username text NOT NULL); ', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Users table: ', err);
        });
    }

    saveUsers(users: IUser[]) {
        var self = this;

        users.forEach(user => {
            self.addUser(user);
        });
    }

    addUser(user: IUser) {
        var self = this;
        let query: string = 'INSERT INTO Users (uid, username) Values (?,?)';
        self.db.executeSql(query, [user.uid, user.username]).then((data) => {
            console.log('user ' + user.username + ' added');
        }, (err) => {
            console.error('Unable to add user: ', err);
        });
    }

    saveBars(bars: IBar[]) {
        let self = this;
        let users: IUser[] = [];

        bars.forEach(bar => {
            if (!self.itemsService.includesItem<IUser>(users, u => u.uid === bar.user.uid)) {
                console.log('in add user..' + bar.user.username);
                users.push(bar.user);
            } else {
                console.log('user found: ' + bar.user.username);
            }
            self.addBar(bar);
        });

        self.saveUsers(users);
    }

    addBar(bar: IBar) {
        var self = this;

        let query: string = 'INSERT INTO Bars (key, title, question, category, musicCategory, hotness, datecreated, user, reviews) VALUES (?,?,?,?,?,?,?)';
        self.db.executeSql(query, [
            bar.key,
            bar.title,
            bar.question,
            bar.category,
            bar.musicCategory,
            bar.hotness,
            bar.dateCreated,
            bar.user.uid,
            bar.reviews
        ]).then((data) => {
            console.log('bar ' + bar.key + ' added');
        }, (err) => {
            console.error('Unable to add bar: ', err);
        });
    }

    getBars(): any {
        var self = this;
        return self.db.executeSql('SELECT Bars.*, username FROM Bars INNER JOIN Users ON Bars.user = Users.uid', {});
    }
}
