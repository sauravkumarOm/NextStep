// App.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from "framer-motion";

const App = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Three.js setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);

        // Add particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;

        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0xFFFFFF,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 3;

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.001;
            renderer.render(scene, camera);
        };

        animate();

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            //   canvasRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-amber-500 text-white overflow-x-hidden">
            {/* 3D Background */}
            <div ref={canvasRef} className="absolute inset-0 z-0"></div>

            {/* Container */}
            <div className="relative z-10">
                {/* Header */}
                <header className="py-6">
                    <div className="container mx-auto px-4">
                        <nav className="flex justify-between items-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                                NextStep
                            </div>
                            <div className="hidden md:flex space-x-6">
                                <a href="#" className="hover:text-amber-200 transition duration-300">Home</a>
                                <a href="#" className="hover:text-amber-200 transition duration-300">Courses</a>
                                <a href="#" className="hover:text-amber-200 transition duration-300">Partners</a>
                                <a href="#" className="hover:text-amber-200 transition duration-300">Success Stories</a>
                                <a href="#" className="hover:text-amber-200 transition duration-300">About Us</a>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4">
                    <div className="max-w-3xl transform translate-z-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
                            Transform Your Future with Skills That Matter
                        </h1>
                        <p className="text-lg mb-10 opacity-90 leading-relaxed">
                            Connect with NGOs offering quality skill training and employers seeking fresh talent.
                            Build your career path and find opportunities that match your newly acquired skills.
                        </p>

                    </div>

                    {/* Login Options */}
                    <div className="mt-8 perspective-1000">
                        <h2 className="text-2xl font-bold mb-8">Get Started Today</h2>
                        <div className="flex flex-col md:flex-row gap-8 justify-center">
                            {/* Job Seeker Card */}
                            <div className="bg-gradient-to-br from-blue-900/30 to-blue-600/10 backdrop-blur-md rounded-3xl p-8 w-full md:w-72 text-center shadow-xl border border-white/20 transform rotate-x-10 hover:rotate-x-0 transition duration-500 hover:translate-z-4">
                                <div className="mb-4">
                                    <svg className="w-16 h-16 mx-auto text-blue-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.67 0-11 2.45-11 5.5V22h22v-2.5c0-3.05-5.33-5.5-11-5.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Job Seeker</h3>
                                <p className="mb-6 opacity-80 text-sm">
                                    Learn new skills, build your profile, and connect with employers looking for your talents.
                                </p>
                                <a href="/user/login" className="block w-full py-3 px-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 font-bold hover:-translate-y-1 transition duration-300 shadow-lg mb-4">
                                    Login as Seeker
                                </a>

                            </div>

                            {/* Recruiter Card */}
                            <div className="bg-gradient-to-br from-orange-900/30 to-red-600/10 backdrop-blur-md rounded-3xl p-8 w-full md:w-72 text-center shadow-xl border border-white/20 transform rotate-x-10 hover:rotate-x-0 transition duration-500 hover:translate-z-4">
                                <div className="mb-4">
                                    <svg className="w-16 h-16 mx-auto text-orange-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Recruiter</h3>
                                <p className="mb-6 opacity-80 text-sm">
                                    Find skilled candidates, post job openings, and connect with NGOs training future employees.
                                </p>
                                <a href="/recruiter" className="block w-full py-3 px-6 rounded-full bg-gradient-to-r from-orange-400 to-red-500 font-bold hover:-translate-y-1 transition duration-300 shadow-lg mb-4">
                                    Login as Recruiter
                                </a>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto mt-5">


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            {/* Feature 1 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 transition duration-300 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                                        <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                                        <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Quality Skill Training</h3>
                                <p className="text-white/80">
                                    Partner with verified NGOs offering industry-relevant skill development programs designed to match current job market needs.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 transition duration-300 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-amber-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <polyline points="17 11 19 13 23 9"></polyline>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Direct Job Connections</h3>
                                <p className="text-white/80">
                                    Get matched with employers looking for your exact skill set, with no intermediaries slowing down your job search process.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 transition duration-300 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-green-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                                        <path d="M8 11h8"></path>
                                        <path d="M8 15h5"></path>
                                        <path d="M8 7h3"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Personalized Learning Paths</h3>
                                <p className="text-white/80">
                                    Follow customized learning roadmaps based on your career goals and interests, with progress tracking and skill assessments.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 transition duration-300 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Comprehensive Support</h3>
                                <p className="text-white/80">
                                    Receive mentorship, career counseling, and ongoing support to help you navigate your job search and professional development.
                                </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 transition duration-300 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
                                <p className="text-white/80">
                                    Monitor your skill development journey with detailed analytics, assessments, and milestones to keep you motivated.
                                </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 transition duration-300 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <path d="M9 3v18"></path>
                                        <path d="M15 3v18"></path>
                                        <path d="M3 9h18"></path>
                                        <path d="M3 15h18"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Verified Employers</h3>
                                <p className="text-white/80">
                                    Connect with vetted companies committed to fair hiring practices and valuing skills over traditional credentials.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 px-4">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="p-6">
                                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">10,000+</div>
                                <p className="text-white/80">Trained Professionals</p>
                            </div>
                            <div className="p-6">
                                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-300 to-red-500 bg-clip-text text-transparent">250+</div>
                                <p className="text-white/80">Partner NGOs</p>
                            </div>
                            <div className="p-6">
                                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">750+</div>
                                <p className="text-white/80">Hiring Companies</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md rounded-3xl p-10 text-center shadow-2xl border border-white/10">
                            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                            <p className="text-lg mb-8 max-w-xl mx-auto">
                                Join NextStep today and connect with NGOs offering quality training programs and employers seeking fresh talent.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <a href="#" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 font-bold hover:-translate-y-1 transition duration-300 transform shadow-lg">
                                    Sign Up as Job Seeker
                                </a>
                                <a href="#" className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500 font-bold hover:-translate-y-1 transition duration-300 transform shadow-lg">
                                    Register as Recruiter
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 border-t border-white/10">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4">NextStep</h3>
                                <p className="text-white/70">
                                    Connecting skilled talent with meaningful opportunities through NGO partnerships.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">For Job Seekers</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-white/70 hover:text-white">Find Courses</a></li>
                                    <li><a href="#" className="text-white/70 hover:text-white">Skill Assessments</a></li>
                                    <li><a href="#" className="text-white/70 hover:text-white">Job Listings</a></li>
                                    <li><a href="#" className="text-white/70 hover:text-white">Career Guidance</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">For Recruiters</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-white/70 hover:text-white">Post Jobs</a></li>
                                    <li><a href="#" className="text-white/70 hover:text-white">Find Candidates</a></li>
                                    <li><a href="#" className="text-white/70 hover:text-white">NGO Partnerships</a></li>
                                    <li><a href="#" className="text-white/70 hover:text-white">Hiring Solutions</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Contact Us</h4>
                                <ul className="space-y-2">
                                    <li className="text-white/70">info@NextStep.org</li>
                                    <li className="text-white/70">+1 (555) 123-4567</li>
                                    <li className="text-white/70">123 Impact Avenue, Suite 200</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
                            © 2025 NextStep. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default App;