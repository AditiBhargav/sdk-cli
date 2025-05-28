CREATE TABLE IF NOT EXISTS encoded_api_keys (
  ea_key UUID PRIMARY KEY,
  customer_id VARCHAR(100),
  key_name VARCHAR(50),
  api_key TEXT
);

CREATE TABLE IF NOT EXISTS decoded_api_keys (
  ea_key UUID PRIMARY KEY,
  customer_id VARCHAR(100),
  email_id VARCHAR(100),
  product_name VARCHAR(100),
  no_of_users INT,
  compare_quotation BOOLEAN,
  two_way_reconciliation BOOLEAN,
  three_way_reconciliation BOOLEAN,
  ai_tokens_monthly INT,
  total_pdf_pages_monthly INT
);
