#!/usr/bin/mongo

var db = new Mongo().getDB("datasdb");

db.datas.remove({});

db.datas.insert([
  {letter:"abc",frequency:123},
  {letter:"sdsdasdbc",frequency:124523}
]);
