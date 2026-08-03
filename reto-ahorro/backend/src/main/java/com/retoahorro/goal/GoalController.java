package com.retoahorro.goal;

import com.retoahorro.goal.dto.*;
import com.retoahorro.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public List<GoalResponse> listGoals(@AuthenticationPrincipal User usuario) {
        return goalService.listGoals(usuario);
    }

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @Valid @RequestBody CreateGoalRequest request,
            @AuthenticationPrincipal User usuario
    ) {
        return ResponseEntity.ok(goalService.createGoal(request, usuario));
    }

    @GetMapping("/{id}")
    public GoalResponse getGoal(@PathVariable Long id, @AuthenticationPrincipal User usuario) {
        return goalService.getGoal(id, usuario);
    }

    @GetMapping("/{id}/contributions")
    public List<ContributionResponse> listContributions(
            @PathVariable Long id,
            @AuthenticationPrincipal User usuario
    ) {
        return goalService.listContributions(id, usuario);
    }

    @PostMapping("/{id}/contributions")
    public ResponseEntity<ContributionResponse> addContribution(
            @PathVariable Long id,
            @Valid @RequestBody CreateContributionRequest request,
            @AuthenticationPrincipal User usuario
    ) {
        return ResponseEntity.ok(goalService.addContribution(id, request, usuario));
    }

    @GetMapping("/{id}/participants")
    public List<com.retoahorro.user.UserResponse> listParticipants(
            @PathVariable Long id,
            @AuthenticationPrincipal User usuario
    ) {
        return goalService.listParticipants(id, usuario);
    }

    @PostMapping("/{id}/participants")
    public ResponseEntity<com.retoahorro.user.UserResponse> addParticipant(
            @PathVariable Long id,
            @Valid @RequestBody AddParticipantRequest request,
            @AuthenticationPrincipal User usuario
    ) {
        return ResponseEntity.ok(goalService.addParticipant(id, request, usuario));
    }
}