import {Component, Input, OnInit} from '@angular/core';
import {AnonymousCredential, RemoteMongoClient, Stitch} from 'mongodb-stitch-browser-sdk'
import StitchAppClient from "mongodb-stitch-browser-core/dist/esm/core/StitchAppClient";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  rows: number[][];
  names: string[];
  allNames: string[];
  client: StitchAppClient;
  db: any;
  @Input() players: string;

  constructor() {
  }

  ngOnInit() {
    this.client = Stitch.initializeDefaultAppClient("ubb-qtgom");
    this.db = this.client.getServiceClient(RemoteMongoClient.factory, "ubb-service").db("ubb-db");
    this.names = new Array<string>(+this.players);

    this.login().then(() => this.getAllNames());

    this.rows = new Array<Array<number>>();
    for (let x = 0; x <= +this.players; x++) {
      let row: number[] = new Array<number>();
      for (let y = 0; y <= 7; y++) {
        row.push(0);
      }
      this.rows.push(row);
    }
  }

  sum(row: number) {
    return this.rows[row].reduce((a, b) => a + b, 0);
  }

  getCell(row: number, col: number) {
    let value = this.rows[row][col];
    return value === 0 ? '' : value;
  }

  saveName(name: string) {
    if (this.allNames.includes(name) || name.length < 2) {
      return;
    }

    this.login().then(user => this.saveNewName(name)
    ).then(() => this.getAllNames());
  }

  private saveNewName(name: string) {
    return this.db.collection('users').insertOne({owner_id: this.client.auth.user.id, name: name});
  }

  private login() {
    return this.client.auth.loginWithCredential(new AnonymousCredential());
  }

  private getAllNames() {
    this.db.collection("users").find({}).asArray()
      .then(docs => this.allNames = docs.map(user => user.name))
      .catch(err => console.error(err));
  }


}
