CREATE TABLE IF NOT EXISTS location(
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(18,6),
    longitude NUMERIC(18,6)
);