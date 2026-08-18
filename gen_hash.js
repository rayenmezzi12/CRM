const crypto = require('crypto');

// BCrypt implementation using known test vector
// Using the well-known BCrypt hash for 'password' from PHP/Laravel test suite
// $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi = "password"

// We'll use a Spring Boot approach - call the actuator or create a temp endpoint
// Instead, let's generate using Node's built-in crypto to create a simple script

// Use known verified BCrypt hash pairs:
// password: "Admin123!" 
// We need to compute this properly

// Since bcryptjs isn't installed globally, let's install it temporarily
const { execSync } = require('child_process');

try {
  execSync('npm install bcryptjs --no-save', { stdio: 'inherit' });
  const bcrypt = require('./node_modules/bcryptjs');
  const password = 'Admin123!';
  const hash = bcrypt.hashSync(password, 10);
  console.log('HASH:' + hash);
  
  // Verify
  const valid = bcrypt.compareSync(password, hash);
  console.log('VERIFY:' + valid);
} catch(e) {
  console.error(e.message);
}
