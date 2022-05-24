INSERT INTO department
  (name)
VALUES
  ('Marketing'),
  ('Accounting'),
  ('R&D'),
  ('Customer Service');



INSERT INTO role
  (title, salary, department_id)
VALUES

   
      ('Marketing Associate', 50000, 1),
      ('Accounting Associate', 50000, 2),
      ('R & D Associate', 50000, 3),
      ('Customer Service Associate', 50000, 4);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Smith', 1, 2),
  ('Jane', 'Smith', 1, 2),
  ('John', 'Doe', 2, 2),
  ('Jane', 'Doe', 2, 2),
  ('Jacob', 'Lauterstein', 3, 2),
  ('Jackie', 'Harper', 3, 2),
  ('Lauren', 'Hemphill', 4, 2),
  ('Lorenzo', 'Hemphill', 4, 2);
 
 