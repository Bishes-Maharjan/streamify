'use client';
import { LANGUAGES } from '@/constants/constants';
import { axiosInstance } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import {
  AlertCircleIcon,
  CameraIcon,
  LoaderIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type User = {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  image: string;
  location: string;
  _id: string;
  isOnBoarded: boolean;
};

const OnboardingForm = ({
  userFromServer: authUser,
}: {
  userFromServer: User;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState(() => ({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    image: authUser?.image || '',
  }));

  const [errors, setErrors] = useState({
    fullName: '',
    location: '',
  });

  const [imageCount, setImageCount] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const newErrors = {
      fullName:
        formState.fullName.length < 3
          ? 'Name must be at least 3 characters'
          : '',
      location:
        formState.location.length < 2 ? 'Please enter a valid location' : '',
    };

    setErrors(newErrors);
    setIsFormValid(
      formState.fullName.length >= 3 &&
        formState.nativeLanguage !== '' &&
        formState.learningLanguage !== '' &&
        formState.location.length >= 2 &&
        Object.values(newErrors).every((error) => error === '')
    );
  }, [formState]);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: async (userData: typeof formState) => {
      const response = await axiosInstance.post('auth/onboard', userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile onboarded successfully');
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      router.replace('/');
    },
    onError: (error) => {
      if (error && isAxiosError(error)) {
        toast.error(error.response?.data.message || 'An error occurred');
      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      onboardingMutation(formState);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleRandomAvatar = async () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setIsLoading(true);
    await toast
      .promise(
        new Promise<void>((resolve) => {
          setFormState((prev) => ({ ...prev, image: randomAvatar }));
          setImageCount((prev) => prev + 1);
          setTimeout(resolve, 500);
        }),
        {
          loading: 'Generating avatar...',
          success: 'Random profile picture generated!',
          error: 'Failed to generate avatar',
        }
      )
      .then(() => setIsLoading(false));
  };

  const handleOriginalAvatar = () => {
    setIsLoading(true);
    setFormState({ ...formState, image: authUser.image });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            {authUser.isOnBoarded ? 'Edit' : 'Complete'} Your Profile
          </h1>
          <Toaster />
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.image ? (
                  <Image
                    fill
                    sizes="90px"
                    className="object-cover"
                    src={formState.image}
                    alt="Profile Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  disabled={isLoading}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
              {imageCount >= 1 && authUser?.image && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOriginalAvatar}
                    disabled={isLoading}
                    className="btn btn-accent"
                  >
                    <ShipWheelIcon className="size-4 mr-2" />
                    Original Avatar
                  </button>
                </div>
              )}
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
                {errors.fullName && (
                  <span className="label-text-alt text-error flex items-center">
                    <AlertCircleIcon className="size-4 mr-1" />
                    {errors.fullName}
                  </span>
                )}
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className={`input input-bordered w-full ${
                  errors.fullName ? 'input-error' : ''
                }`}
                placeholder="Your full name (min 3 chars)"
                minLength={3}
                required
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered"
                placeholder="Tell us a bit about yourself"
              />
            </div>

            {/* NATIVE LANGUAGE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Native Language</span>
              </label>
              <select
                className="select select-bordered"
                value={formState.nativeLanguage}
                onChange={(e) =>
                  setFormState({ ...formState, nativeLanguage: e.target.value })
                }
              >
                <option value="">Select native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* LEARNING LANGUAGE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Learning Language</span>
              </label>
              <select
                className="select select-bordered"
                value={formState.learningLanguage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    learningLanguage: e.target.value,
                  })
                }
              >
                <option value="">Select learning language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION (basic input only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
                {errors.location && (
                  <span className="label-text-alt text-error flex items-center">
                    <AlertCircleIcon className="size-4 mr-1" />
                    {errors.location}
                  </span>
                )}
              </label>
              <input
                type="text"
                name="location"
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
                className={`input input-bordered w-full ${
                  errors.location ? 'input-error' : ''
                }`}
                placeholder="Enter your city or country"
                required
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!isFormValid || isPending}
              >
                {isPending ? (
                  <>
                    <LoaderIcon className="animate-spin mr-2 size-4" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
