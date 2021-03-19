-- create users table
create table users (userid serial primary key, fullname varchar(100), phone varchar(50), email varchar(100), profilephoto varchar(100), password text);

-- create listings table
create table listings (listingid serial primary key, byuser integer, listingimage text, description text, location varchar(100), date timestamptz default current_timestamp, typeoflisting varchar(50), isavailable boolean, price varchar(100));
