CREATE TABLE IF NOT EXISTS location(
    id SERIAL PRIMARY KEY,
    searchQuery VARCHAR(255),
    formattedQuery VARCHAR(255),
    latitude NUMERIC(18,6),
    longitude NUMERIC(18,6)
);