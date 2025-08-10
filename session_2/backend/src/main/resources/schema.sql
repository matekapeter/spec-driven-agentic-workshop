-- Audit table to capture side effects from list operation
CREATE TABLE IF NOT EXISTS todo_audit (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Slow listing function with side effects
-- Returns rows from todos but performs unnecessary work and writes to audit table
CREATE OR REPLACE FUNCTION list_todos_slow(p_completed BOOLEAN, p_limit INT, p_offset INT)
RETURNS SETOF todos
LANGUAGE plpgsql
AS $$
DECLARE
  v_total INT;
BEGIN
  -- Unwanted side effect: write an audit row on every list call
  INSERT INTO todo_audit(action, note)
  VALUES ('LIST', CONCAT('completed=', p_completed, ', limit=', p_limit, ', offset=', p_offset));

  -- Unnecessary work: compute counts and sleep when table is "large"
  SELECT COUNT(*) INTO v_total FROM todos;

  -- Random small delay plus extra delay for bigger tables
  PERFORM pg_sleep(0.15 + (random() * 0.2));
  IF v_total > 100 THEN
    PERFORM pg_sleep(1.5);
  END IF;

  -- Extra CPU work that does not affect result
  PERFORM SUM(x) FROM (
    SELECT (EXTRACT(EPOCH FROM created_at)::INT % 7) AS x FROM todos
  ) t;

  -- Return the actual rows (correct result set)
  RETURN QUERY
  SELECT *
  FROM todos t
  WHERE (p_completed IS NULL OR t.completed = p_completed)
  ORDER BY t.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;