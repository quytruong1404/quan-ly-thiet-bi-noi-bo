package com.company.devicemanagement.repository;

import com.company.devicemanagement.model.BorrowRequest;
import com.company.devicemanagement.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    Optional<BorrowRequest> findByCode(String code);
    List<BorrowRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<BorrowRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
    List<BorrowRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(RequestStatus status);
}
