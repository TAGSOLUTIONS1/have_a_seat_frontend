import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Base_Url } from '@/baseUrl';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Star, X } from 'lucide-react';

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  reservation, 
  onReviewSubmitted 
}) => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [postAsAnonymous, setPostAsAnonymous] = useState(false);
  const [displayName, setDisplayName] = useState(authState?.user?.first_name);
  // console.log("for review" ,authState?.user?.first_name);
  // Reset form when modal opens/closes or reservation changes
  useEffect(() => {
    if (isOpen && reservation) {
      // Pre-populate if review already exists
      setReviewText(reservation?.review || '');
      setStarRating(reservation?.star_rating || 0);
      setDisplayName(reservation?.reviewer_name || "");
    } else if (!isOpen) {
      // Reset when closing
      setReviewText('');
      setStarRating(0);
      setDisplayName("");
      setPostAsAnonymous(false);
    }
  }, [isOpen, reservation]);
 

  const handleSubmit = async () => {
    // Validation
    if (!reviewText.trim()) {
      toast({
        title: 'Review Required',
        description: 'Please write your review before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (starRating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // Check if user is authenticated
    if (!authState?.accessToken) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!reservation?.id) {
      toast({
        title: 'Error',
        description: 'Reservation information is missing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.patch(
        `${Base_Url}/api/v1/reservation/add_review/${reservation.id}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
            accept: 'application/json',
          },
          params: {
            review: reviewText.trim(),
            star_rating: starRating,
            restaurant_id: reservation?.restaurant_id || reservation?.restaurant?.id || reservation?.id,
            restaurant_alias: reservation?.restaurant_alias || reservation?.alias,
            anonymous: postAsAnonymous,
            reviewer_name: postAsAnonymous ? 'Anonymous' : (authState?.user?.first_name|| undefined),
          },
        }
      );

      if (response.data) {
        toast({
          title: 'Review Submitted Successfully!',
          description: 'Thank you for sharing your experience.',
        });
        
        // Reset form
        setReviewText('');
        setStarRating(0);
        
        // Callback to refresh data
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        
        onClose();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Failed to Submit Review',
        description: error.response?.data?.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setStarRating(newRating);
  };

  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-plum to-purple-600 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            Leave a Review
          </DialogTitle>
          <DialogDescription className="text-base">
            Share your experience at <span className="font-semibold text-gray-900">{reservation.restaurant_name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Restaurant Info Card */}
          <div className="bg-gradient-to-r from-plum/10 to-purple-100 rounded-lg p-4 border border-plum/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-plum to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {reservation.restaurant_name
                  ?.split(' ')
                  .slice(0, 2)
                  .map(word => word[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{reservation.restaurant_name}</h3>
                <p className="text-sm text-gray-600">{reservation.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Reservation Date: {new Date(reservation.reservation_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              Your Rating
            </label>
            <div className="flex items-center gap-4">
              <ReactStars
                count={5}
                onChange={handleRatingChange}
                size={40}
                activeColor="#fbbf24"
                color="#e5e7eb"
                value={starRating}
                isHalf={false}
                edit={true}
              />
              {starRating > 0 && (
                <span className="text-sm font-medium text-gray-600">
                  {starRating} {starRating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Your Review
            </label>
            <Textarea
              placeholder="Share your experience... What did you like? What could be improved? Your feedback helps others make better decisions."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[150px] resize-none border-gray-300 focus:border-plum focus:ring-plum"
              maxLength={1000}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Be honest and helpful in your review</span>
              <span>{reviewText.length}/1000 characters</span>
            </div>
          </div>

          {/* Identity Preference */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              How should we show your name?
            </label>
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={postAsAnonymous}
                  onChange={(e) => setPostAsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-plum border-gray-300 rounded focus:ring-plum"
                />
                Post as Anonymous
              </label>
              {!postAsAnonymous && (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Display name (optional)"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum focus:border-plum"
                  />
                  <p className="text-xs text-gray-500">
                    Leave blank to use your account name.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Authentication Notice */}
          {!authState?.accessToken && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You need to be logged in to submit a review.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !authState?.accessToken || starRating === 0 || !reviewText.trim()}
            className="flex-1 sm:flex-none bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;

