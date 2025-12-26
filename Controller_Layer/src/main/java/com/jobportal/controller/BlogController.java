package com.jobportal.controller;

import com.jobportal.model.Blog;
import com.jobportal.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/blogs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Blog>> getBlogsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(blogService.getBlogsByCategory(category));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Blog> createBlog(@RequestBody Blog blog) {
        return ResponseEntity.ok(blogService.createBlog(blog));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody Blog blogDetails) {
        return ResponseEntity.ok(blogService.updateBlog(id, blogDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok("Blog deleted successfully");
    }
}
