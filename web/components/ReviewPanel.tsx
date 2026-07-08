'use client';

import React, { useState } from 'react';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, Award } from 'lucide-react';

export interface StateChange {
  id: string;
  characterName: string;
  changeType: 'Realm Advancement' | 'Status Change' | 'Faction Change' | 'Relationship Shift';
  oldValue: string;
  newValue: string;
  evidence: string;
  confidence: 'High' | 'Medium' | 'Low';
  decision?: 'approved' | 'rejected';
}

export interface Finding {
  id: string;
  severity: 'Violation' | 'Warning' | 'Info';
  type: string;
  description: string;
  evidence: string;
  confidence: 'High' | 'Medium' | 'Low';
  dismissed: boolean;
}

interface ReviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stateChanges: StateChange[];
  findings: Finding[];
  onApproveChange: (changeId: string) => void;
  onRejectChange: (changeId: string) => void;
  onDismissFinding: (findingId: string) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  isOpen,
  onClose,
  stateChanges,
  findings,
  onApproveChange,
  onRejectChange,
  onDismissFinding,
}) => {
  const [showLowConfidence, setShowLowConfidence] = useState(false);
  const [activeTab, setActiveTab] = useState<'changes' | 'findings'>('changes');

  // Filter findings based on confidence level
  const visibleFindings = findings.filter(
    (f) => !f.dismissed && (showLowConfidence || f.confidence !== 'Low')
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Violation':
        return 'bg-danger/20 text-danger border-danger/30';
      case 'Warning':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Info':
        return 'bg-info/20 text-info border-info/30';
      default:
        return 'bg-muted/20 text-muted border-muted/30';
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      High: 'bg-success/20 text-success',
      Medium: 'bg-warning/20 text-warning',
      Low: 'bg-muted/20 text-muted',
    };
    return colors[confidence as keyof typeof colors] || colors.Low;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Violation':
        return <AlertCircle size={18} />;
      case 'Warning':
        return <AlertTriangle size={18} />;
      case 'Info':
        return <Info size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-surface border-l border-surface-hover z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-hover">
          <h2 className="text-2xl font-bold text-foreground">Consistency Check Results</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X size={24} className="text-muted" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-surface-hover">
          <button
            onClick={() => setActiveTab('changes')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors relative ${
              activeTab === 'changes'
                ? 'text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Proposed Changes
            {activeTab === 'changes' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-lg" />
            )}
            {stateChanges.length > 0 && (
              <span className="ml-2 inline-block bg-accent/20 text-accent px-2 py-0.5 rounded text-xs font-semibold">
                {stateChanges.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('findings')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors relative ${
              activeTab === 'findings'
                ? 'text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Findings
            {activeTab === 'findings' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-lg" />
            )}
            {visibleFindings.length > 0 && (
              <span className="ml-2 inline-block bg-accent/20 text-accent px-2 py-0.5 rounded text-xs font-semibold">
                {visibleFindings.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'changes' && (
            <div className="space-y-4">
              {stateChanges.length === 0 ? (
                <div className="py-12 text-center text-muted">
                  <Award size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No proposed state changes</p>
                </div>
              ) : (
                stateChanges.map((change) => (
                  <div
                    key={change.id}
                    className={`p-4 rounded-lg border transition-all ${
                      change.decision
                        ? 'bg-surface-hover/50 border-surface-hover opacity-75'
                        : 'bg-surface-hover border-surface-hover hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{change.characterName}</h3>
                        <p className="text-sm text-muted">{change.changeType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceBadge(change.confidence)}`}>
                        {change.confidence} Confidence
                      </span>
                    </div>

                    <div className="mb-3 p-3 bg-background/50 rounded border border-surface-hover">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">
                          <span className="line-through">{change.oldValue}</span>
                          <span className="mx-2 text-accent">→</span>
                          <span className="font-semibold text-accent">{change.newValue}</span>
                        </span>
                      </div>
                    </div>

                    <blockquote className="pl-3 border-l-2 border-accent/50 text-sm italic text-muted mb-4">
                      "{change.evidence}"
                    </blockquote>

                    {!change.decision ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApproveChange(change.id)}
                          className="flex-1 px-3 py-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          onClick={() => onRejectChange(change.id)}
                          className="flex-1 px-3 py-2 border border-foreground/30 text-foreground rounded-lg hover:border-foreground hover:bg-foreground/5 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className="px-3 py-2 rounded-lg bg-surface border border-surface-hover text-sm font-medium text-center">
                        {change.decision === 'approved' ? (
                          <span className="text-success flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Approved
                          </span>
                        ) : (
                          <span className="text-danger flex items-center justify-center gap-2">
                            <XCircle size={16} /> Rejected
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'findings' && (
            <div className="space-y-4">
              {/* Settings */}
              <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-lg border border-surface-hover">
                <input
                  type="checkbox"
                  id="lowConfidence"
                  checked={showLowConfidence}
                  onChange={(e) => setShowLowConfidence(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-hover cursor-pointer"
                />
                <label htmlFor="lowConfidence" className="text-sm text-foreground cursor-pointer flex-1">
                  Show low-confidence findings
                </label>
              </div>

              {visibleFindings.length === 0 ? (
                <div className="py-12 text-center text-muted">
                  <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No findings</p>
                </div>
              ) : (
                visibleFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className={`p-4 rounded-lg border transition-all ${
                      finding.dismissed
                        ? 'opacity-50'
                        : getSeverityColor(finding.severity)
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">{getSeverityIcon(finding.severity)}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{finding.type}</h3>
                          <p className="text-sm text-foreground/80 mt-1">{finding.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-3 ${getConfidenceBadge(finding.confidence)}`}>
                        {finding.confidence}
                      </span>
                    </div>

                    <blockquote className="pl-3 border-l-2 border-current/50 text-sm italic text-foreground/70 mb-4 opacity-75">
                      "{finding.evidence}"
                    </blockquote>

                    {!finding.dismissed && (
                      <button
                        onClick={() => onDismissFinding(finding.id)}
                        className="text-sm text-foreground/60 hover:text-foreground transition-colors underline"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
