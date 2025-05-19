package com.url_shortener.auth.Services;

import com.url_shortener.auth.Model.User;
import com.url_shortener.auth.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    @Cacheable(value = "userCache", key = "#username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user from database: {}", username);
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Cacheable(value = "userCache", key = "#username")
    public User getUserByUsername(String username) {
        log.debug("Getting user by username from database: {}", username);
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Cacheable(value = "userCache", key = "#email")
    public User getUserByEmail(String email) {
        log.debug("Getting user by email from database: {}", email);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @CacheEvict(value = "userCache", key = "#user.username")
    public void updateUser(User user) {
        userRepo.save(user);
    }

    @CacheEvict(value = "userCache", allEntries = true)
    public void clearUserCache() {
        log.info("Clearing user cache");
    }
}