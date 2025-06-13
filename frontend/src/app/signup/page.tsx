'use client';
import PageLoader from '@/components/PageLoader';
import { handleOAuthLogin } from '@/hooks/OAuth';
import { useAuthUser } from '@/hooks/useAuthUser';
import { axiosInstance } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { ShipWheelIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import singUpImage from '../../../public/signup.png';

const SignUpPage = () => {
  const router = useRouter();
  const { isLoading } = useAuthUser();
  // useEffect(() => {
  //   if (user) router.push('/');
  // }, [user, isLoading, router]);
  const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    image: `https://avatar.iran.liara.run/public/${idx}.png`,
  });

  const [err, setErr] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post('auth/signup', signupData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      setErr(null); // clear error on success
      router.push('/onboard');
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setErr(error.response?.data.message);
      } else {
        setErr('Something went wrong. Please try again.');
      }
    },
  });
  const handleSingup = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutate();
  };
  if (isLoading) return <PageLoader />;

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {err && (
            <div className="alert alert-error mb-4">
              <span>{err}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSingup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join Streamify and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* FULLNAME */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* EMAIL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* PASSWORD */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{' '}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{' '}
                        and{' '}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="divider text-sm opacity-70">OR</div>

                <button
                  type="button"
                  onClick={handleOAuthLogin}
                  className="btn w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 flex items-center justify-center gap-2"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google icon"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <Image
                src={singUpImage}
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
