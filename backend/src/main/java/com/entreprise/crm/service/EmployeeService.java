package com.entreprise.crm.service;

import com.entreprise.crm.dto.EmployeeDTO;
import com.entreprise.crm.entity.Employee;
import com.entreprise.crm.entity.Role;
import com.entreprise.crm.entity.User;
import com.entreprise.crm.repository.EmployeeRepository;
import com.entreprise.crm.repository.RoleRepository;
import com.entreprise.crm.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, UserRepository userRepository, 
                           RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<EmployeeDTO> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::mapToDTO);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapToDTO(employee);
    }

    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        Employee employee = new Employee();
        updateEntityFromDTO(employee, dto);

        // Optionally create user account for employee
        if (dto.getEmail() != null && !userRepository.existsByEmail(dto.getEmail())) {
            User user = new User();
            user.setUsername(dto.getEmail()); // use email as username for simplicity
            user.setEmail(dto.getEmail());
            user.setPassword(passwordEncoder.encode("employee123")); // Default password
            
            Role employeeRole = roleRepository.findByName("ROLE_EMPLOYEE")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(employeeRole);
            user.setMustChangePassword(true);
            
            user = userRepository.save(user);
            employee.setUser(user);
        }

        Employee saved = employeeRepository.save(employee);
        return mapToDTO(saved);
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        updateEntityFromDTO(employee, dto);
        Employee updated = employeeRepository.save(employee);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        if (employee.getUser() != null) {
            userRepository.delete(employee.getUser());
        }
        employeeRepository.delete(employee);
    }

    public EmployeeDTO getEmployeeByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));
        return mapToDTO(employee);
    }

    private EmployeeDTO mapToDTO(Employee entity) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setDepartment(entity.getDepartment());
        dto.setPosition(entity.getPosition());
        dto.setHireDate(entity.getHireDate());
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
        }
        return dto;
    }

    private void updateEntityFromDTO(Employee entity, EmployeeDTO dto) {
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setDepartment(dto.getDepartment());
        entity.setPosition(dto.getPosition());
        entity.setHireDate(dto.getHireDate());
    }
}
