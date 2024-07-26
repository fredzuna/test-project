import { db } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const personTable = body;

    personTable.map(async (item: Person) => {
      const { id, first_name, last_name, company, address, city, state, zip_phone } = item;
      console.log(item);
      
      // Insert or update the person record
      await client.sql`
    INSERT INTO person (id, first_name, last_name, company, address, city, state, zip_phone)
    VALUES (${id}, ${first_name}, ${last_name}, ${company}, ${address}, ${city}, ${state}, ${zip_phone})
    ON CONFLICT (id) 
    DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      company = EXCLUDED.company,
      address = EXCLUDED.address,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      zip_phone = EXCLUDED.zip_phone;
  `;

    })

    return NextResponse.json({ message: 'Record inserted/updated successfully' });
  } catch (error: any) {
    console.error('Error inserting/updating record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
