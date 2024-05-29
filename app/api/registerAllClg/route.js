import { NextResponse } from "next/server";
import fs from 'fs';
import parse from 'csv-parser'
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
export async function GET(request) {
  const client = await pool.connect();

  var csvData = [];
  fs.createReadStream("collageData.csv")
    .pipe(parse({ delimiter: ':' }))
    .on('data', function (csvrow) {

      //do something with csvrow
      csvData.push(csvrow);
    })
    .on('end', async function () {
      //do something with csvData
      for (const item of csvData) {
        
        const insertCollegeQuery = `
            INSERT INTO institute_info (institute_code,
              institute_name,
              departments,
              gopens,
              gscs,
              gsts,
              gvjs,
              gnt1s,
              gnt2s,
              gnt3s,
              gobcs,
              tfws,
              ews,city)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13,$14)
        `;
        await client.query(insertCollegeQuery, [
          item.institute_code,
          item.institute_name,
          item.departments,
          item.gopen,
          item.gscs,
          item.gsts,
          item.gvjs,
          item.gnt1s,
          item.gnt2s,
          item.gnt3s,
          item.gobcs,
          item.tfws,
          item.ews,
          item.city,
        ]);
 
      }
    });

  // const {
  //   clg_code,
  //   name,
  //   dept,
  //   city,
  //   gopen,
  //   gscs,
  //   gsts,
  //   gvjs,
  //   gnt1s,
  //   gnt2s,
  //   gnt3s,
  //   gobcs,
  //   tfws,
  //   ews,
  // } = csvData;




  // const insertCollegeQuery = `
  //           INSERT INTO institute_info (institute_code,
  //             institute_name,
  //             departments,
  //             gopens,
  //             gscs,
  //             gsts,
  //             gvjs,
  //             gnt1s,
  //             gnt2s,
  //             gnt3s,
  //             gobcs,
  //             tfws,
  //             ews,city)
  //           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13,$14)
  //       `;
  // await client.query(insertCollegeQuery, [
  //   clg_code,
  //   name,
  //   dept,
  //   gopen,
  //   gscs,
  //   gsts,
  //   gvjs,
  //   gnt1s,
  //   gnt2s,
  //   gnt3s,
  //   gobcs,
  //   tfws,
  //   ews,
  //   city,
  // ]);
  client.release();
  //Close connection

  return NextResponse.json({ message: "Registertion Done" }, { status: "200" });
}
