package com.entreprise.crm.service;

import com.entreprise.crm.dto.ClientDTO;
import com.entreprise.crm.entity.Client;
import com.entreprise.crm.entity.Role;
import com.entreprise.crm.entity.User;
import com.entreprise.crm.repository.ClientRepository;
import com.entreprise.crm.repository.RoleRepository;
import com.entreprise.crm.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ClientService(ClientRepository clientRepository, UserRepository userRepository,
                         RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<ClientDTO> getAllClients(Pageable pageable) {
        return clientRepository.findAll(pageable).map(this::mapToDTO);
    }

    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return mapToDTO(client);
    }

    @Transactional
    public ClientDTO createClient(ClientDTO dto) {
        Client client = new Client();
        updateEntityFromDTO(client, dto);

        // Automatically create user account for client
        if (dto.getEmail() != null && !userRepository.existsByEmail(dto.getEmail())) {
            User user = new User();
            user.setUsername(dto.getEmail()); // use email as username
            user.setEmail(dto.getEmail());
            user.setPassword(passwordEncoder.encode("client123")); // Default temporary password
            
            Role clientRole = roleRepository.findByName("ROLE_CLIENT")
                    .orElseThrow(() -> new RuntimeException("Role ROLE_CLIENT not found"));
            user.setRole(clientRole);
            user.setMustChangePassword(true);
            
            user = userRepository.save(user);
            client.setUser(user);
        }

        Client saved = clientRepository.save(client);
        return mapToDTO(saved);
    }

    @Transactional
    public ClientDTO updateClient(Long id, ClientDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        updateEntityFromDTO(client, dto);
        Client updated = clientRepository.save(client);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        if (client.getUser() != null) {
            userRepository.delete(client.getUser());
        }
        clientRepository.delete(client);
    }

    public ClientDTO getClientByUserId(Long userId) {
        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));
        return mapToDTO(client);
    }

    private ClientDTO mapToDTO(Client entity) {
        ClientDTO dto = new ClientDTO();
        dto.setId(entity.getId());
        dto.setCompanyName(entity.getCompanyName());
        dto.setContactName(entity.getContactName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setAddress(entity.getAddress());
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
        }
        return dto;
    }

    private void updateEntityFromDTO(Client entity, ClientDTO dto) {
        entity.setCompanyName(dto.getCompanyName());
        entity.setContactName(dto.getContactName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setAddress(dto.getAddress());
    }
}
