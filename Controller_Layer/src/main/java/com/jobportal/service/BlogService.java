package com.jobportal.service;

import com.jobportal.model.Blog;
import com.jobportal.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    public List<Blog> getAllBlogs() {
        return blogRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Blog> getBlogsByCategory(String category) {
        return blogRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
    }

    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    public Blog updateBlog(Long id, Blog blogDetails) {
        Blog blog = getBlogById(id);
        blog.setTitle(blogDetails.getTitle());
        blog.setContent(blogDetails.getContent());
        blog.setCategory(blogDetails.getCategory());
        blog.setAuthor(blogDetails.getAuthor());
        blog.setImageUrl(blogDetails.getImageUrl());
        blog.setSummary(blogDetails.getSummary());
        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id) {
        Blog blog = getBlogById(id);
        blogRepository.delete(blog);
    }
}
