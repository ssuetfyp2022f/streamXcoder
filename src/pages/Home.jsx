import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Play,
	Sparkles,
	Zap,
	Rocket,
	Brain,
	ArrowRight,
	Star,
	Users,
	Clock,
	MousePointer,
	Cpu,
	Database,
	Terminal,
	BookOpen,
	GitBranch,
	Cloud,
	Layers,
	Command,
	Video,
	ShieldCheck,
} from "lucide-react";

// Typewriter component (install if needed: npm install react-simple-typewriter)
const TypewriterText = () => {
	const [textIndex, setTextIndex] = useState(0);
	const texts = ["V", "Vi", "Vid", "Vide", "Video", "Videos"];

	useEffect(() => {
		const interval = setInterval(() => {
			setTextIndex((prev) => (prev + 1) % texts.length);
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<span className="text-[#00ADB5] inline-block min-w-50">
			{texts[textIndex]}
			<span className="animate-pulse">|</span>
		</span>
	);
};

// const Home = () => {
//   const [activeTab, setActiveTab] = useState('trending');
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [scrollProgress, setScrollProgress] = useState(0);

//   // Scroll progress
//   useEffect(() => {
//     const handleScroll = () => {
//       const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
//       const currentProgress = (window.scrollY / totalScroll) * 100;
//       setScrollProgress(currentProgress);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Categories
//   const categories = [
//     { icon: Cpu, name: 'React', color: '#61DAFB', count: 45 },
//     { icon: Database, name: 'Node.js', color: '#8CC84B', count: 32 },
//     { icon: Terminal, name: 'Python', color: '#3776AB', count: 28 },
//     { icon: Layers, name: 'Full Stack', color: '#FF6B35', count: 56 },
//     { icon: Cloud, name: 'DevOps', color: '#00ADB5', count: 18 },
//     { icon: Brain, name: 'AI/ML', color: '#FF4081', count: 24 },
//   ];

//   // Features
//   const features = [
//     {
//       icon: Play,
//       title: 'Live Code Editor',
//       description: 'Code alongside videos in real-time',
//       color: '#00ADB5'
//     },
//     {
//       icon: Zap,
//       title: 'Instant Feedback',
//       description: 'Get immediate results and error checking',
//       color: '#FFD700'
//     },
//     // {
//     //   icon: GitBranch,
//     //   title: 'Version Control',
//     //   description: 'Save and manage different code versions',
//     //   color: '#F1502F'
//     // },
//     {
//       icon: ShieldCheck,
//       title: 'Progress Tracking',
//       description: 'Track your learning journey with analytics',
//       color: '#4CAF50'
//     },
//   ];

const Home = () => {
	const [activeTab, setActiveTab] = useState("trending");
	const [hoveredCard, setHoveredCard] = useState(null);
	const [scrollProgress, setScrollProgress] = useState(0);

	// Scroll progress
	useEffect(() => {
		const handleScroll = () => {
			const totalScroll =
				document.documentElement.scrollHeight - window.innerHeight;
			const currentProgress = (window.scrollY / totalScroll) * 100;
			setScrollProgress(currentProgress);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Dummy categories
	const categories = [
		{ icon: Cpu, name: "React", color: "#61DAFB", count: 45 },
		{ icon: Database, name: "Node.js", color: "#8CC84B", count: 32 },
		{ icon: Terminal, name: "Python", color: "#3776AB", count: 28 },
		{ icon: Layers, name: "Full Stack", color: "#FF6B35", count: 56 },
		{ icon: Cloud, name: "DevOps", color: "#00ADB5", count: 18 },
		{ icon: Brain, name: "AI/ML", color: "#FF4081", count: 24 },
	];

	// Dummy features
	const features = [
		{
			icon: Play,
			title: "Live Code Editor",
			description: "Code alongside videos in real-time",
			color: "#00ADB5",
		},
		{
			icon: Zap,
			title: "Instant Feedback",
			description: "Get immediate results and error checking",
			color: "#FFD700",
		},
		{
			icon: ShieldCheck,
			title: "Progress Tracking",
			description: "Track your learning journey with analytics",
			color: "#4CAF50",
		},
	];

	// Videos data
	const videos = [
		{
			id: 1,
			title: "Master React Hooks & Context API",
			description:
				"Deep dive into advanced React patterns with practical examples",
			thumbnail:
				"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
			duration: "42:18",
			author: "React Pro",
			views: "15.2K",
			category: "React",
			level: "Advanced",
			rating: 4.9,
			tags: ["useState", "useEffect", "Context"],
		},
		{
			id: 2,
			title: "Node.js Microservices Architecture",
			description: "Build scalable microservices with Docker and Kubernetes",
			thumbnail:
				"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop",
			duration: "58:34",
			author: "Backend Guru",
			views: "23.7K",
			category: "Node.js",
			level: "Expert",
			rating: 4.8,
			tags: ["Docker", "K8s", "RabbitMQ"],
		},
		{
			id: 3,
			title: "Next.js 14 Complete Guide",
			description: "Server components, app router, and advanced patterns",
			thumbnail:
				"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
			duration: "36:45",
			author: "Frontend Master",
			views: "31.4K",
			category: "Next.js",
			level: "Intermediate",
			rating: 4.9,
			tags: ["App Router", "SSR", "ISR"],
		},
		{
			id: 4,
			title: "TypeScript Masterclass",
			description: "Advanced TypeScript patterns and best practices",
			thumbnail:
				"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
			duration: "51:22",
			author: "TS Expert",
			views: "28.9K",
			category: "TypeScript",
			level: "Advanced",
			rating: 4.7,
			tags: ["Generics", "Decorators", "Utility Types"],
		},
		{
			id: 5,
			title: "GraphQL with Apollo & React",
			description: "Modern GraphQL implementation with real-time subscriptions",
			thumbnail:
				"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
			duration: "45:10",
			author: "GraphQL Ninja",
			views: "19.3K",
			category: "GraphQL",
			level: "Intermediate",
			rating: 4.6,
			tags: ["Apollo", "Subscriptions", "Schema"],
		},
		{
			id: 6,
			title: "AWS Serverless Architecture",
			description: "Build serverless applications with Lambda and DynamoDB",
			thumbnail:
				"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",
			duration: "39:55",
			author: "Cloud Architect",
			views: "34.6K",
			category: "AWS",
			level: "Expert",
			rating: 4.8,
			tags: ["Lambda", "DynamoDB", "API Gateway"],
		},
	];

	return (
		<div className="min-h-screen relative overflow-hidden bg-[#0A0F1C]">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
				<div className="container mx-auto relative z-10">
					<div className="max-w-6xl mx-auto">
						{/* Animated Badge */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 backdrop-blur-sm"
							style={{
								backgroundColor: "rgba(0, 173, 181, 0.1)",
								border: "1px solid rgba(0, 173, 181, 0.3)",
							}}
						>
							<Sparkles className="text-[#00ADB5]" size={16} />
							<span
								className="text-sm font-semibold"
								style={{ color: "#00ADB5" }}
							>
								✨ 10,000+ Developers Learning Daily
							</span>
						</motion.div>

						{/* Main Heading */}
						<div className="mb-8 relative">
							<motion.h1
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8 }}
								className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
							>
								<span className="block" style={{ color: "#EEEEEE" }}>
									Code Along
								</span>
								<div className="relative inline-block">
									<span className="relative z-10 " style={{ color: "#00ADB5" }}>
										With <TypewriterText />
									</span>
									<motion.div
										className="absolute inset-0 opacity-20 blur-xl"
										style={{ backgroundColor: "#00ADB5" }}
										animate={{
											opacity: [0.1, 0.3, 0.1],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
										}}
									/>
								</div>
							</motion.h1>

							{/* Subtitle */}
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12"
							>
								Watch, code, and master modern technologies with our interactive
								video platform. Real-time coding environment, instant feedback,
								and expert-led tutorials.
							</motion.p>
						</div>

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="flex flex-wrap gap-6 mb-16"
						>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="group relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden"
								style={{
									backgroundColor: "#00ADB5",
									color: "#FFFFFF",
								}}
							>
								<span className="relative z-10 flex items-center gap-3">
									<Rocket size={20} />
									Start Free Journey
									<ArrowRight
										size={20}
										className="group-hover:translate-x-2 transition-transform"
									/>
								</span>
								<motion.div
									className="absolute inset-0"
									style={{ backgroundColor: "#393E46" }}
									initial={{ x: "-100%" }}
									whileHover={{ x: 0 }}
									transition={{ duration: 0.3 }}
								/>
							</motion.button>

							{/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-xl font-bold text-lg border-2 relative overflow-hidden"
                style={{ 
                  borderColor: '#00ADB5',
                  color: '#00ADB5'
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Terminal size={20} />
                  Try Code Editor
                  <MousePointer size={20} className="animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ADB5] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.button> */}
						</motion.div>

						{/* Stats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl"
						>
							{[
								{
									icon: Users,
									value: "50K+",
									label: "Active Coders",
									color: "#00ADB5",
								},
								{
									icon: Video,
									value: "1K+",
									label: "Video Tutorials",
									color: "#61DAFB",
								},
								{
									icon: Clock,
									value: "500+",
									label: "Hours Content",
									color: "#8CC84B",
								},
								{
									icon: Star,
									value: "4.9",
									label: "Average Rating",
									color: "#FFD700",
								},
							].map((stat, idx) => (
								<motion.div
									key={idx}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 1 + idx * 0.1, type: "spring" }}
									whileHover={{ y: -5 }}
									className="text-center p-6 rounded-2xl backdrop-blur-sm"
									style={{
										backgroundColor: "rgba(57, 62, 70, 0.3)",
										border: "1px solid rgba(255, 255, 255, 0.1)",
									}}
								>
									<div
										className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
										style={{ backgroundColor: "rgba(0, 173, 181, 0.1)" }}
									>
										<stat.icon size={28} style={{ color: stat.color }} />
									</div>
									<div
										className="text-3xl font-bold mb-1"
										style={{ color: stat.color }}
									>
										{stat.value}
									</div>
									<div className="text-sm text-gray-400">{stat.label}</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-20 relative">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2
							className="text-4xl md:text-5xl font-bold mb-4"
							style={{ color: "#EEEEEE" }}
						>
							Explore <span style={{ color: "#00ADB5" }}>Technologies</span>
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto">
							Dive into modern tech stacks with hands-on projects and real-world
							applications
						</p>
					</motion.div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{categories.map((category, idx) => (
							<motion.div
								key={idx}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								whileHover={{
									y: -10,
									scale: 1.05,
									transition: { type: "spring", stiffness: 300 },
								}}
								transition={{ delay: idx * 0.1 }}
								className="relative group"
								onMouseEnter={() => setHoveredCard(idx)}
								onMouseLeave={() => setHoveredCard(null)}
							>
								<div
									className="p-6 rounded-2xl text-center backdrop-blur-sm"
									style={{
										backgroundColor: "rgba(57, 62, 70, 0.4)",
										border: "1px solid rgba(255, 255, 255, 0.1)",
										transform:
											hoveredCard === idx
												? "perspective(1000px) rotateX(5deg)"
												: "none",
										transition: "all 0.3s ease",
									}}
								>
									<div
										className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
										style={{ backgroundColor: `${category.color}20` }}
									>
										<category.icon
											size={28}
											style={{ color: category.color }}
										/>
										<motion.div
											className="absolute inset-0 rounded-full"
											style={{ border: `2px solid ${category.color}` }}
											initial={{ scale: 0.8, opacity: 0 }}
											animate={
												hoveredCard === idx ? { scale: 1.2, opacity: 0.5 } : {}
											}
										/>
									</div>
									<h3
										className="font-bold text-lg mb-2"
										style={{ color: "#EEEEEE" }}
									>
										{category.name}
									</h3>
									<div className="text-sm text-gray-400">
										{category.count} Courses
									</div>

									{/* Hover Effect */}
									<motion.div
										className="absolute inset-0 rounded-2xl -z-10"
										style={{ backgroundColor: category.color }}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={
											hoveredCard === idx ? { opacity: 0.1, scale: 1 } : {}
										}
									/>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<motion.div
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<div
									className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
									style={{
										backgroundColor: "rgba(0, 173, 181, 0.1)",
										color: "#00ADB5",
									}}
								>
									<Zap size={16} />
									<span className="text-sm font-semibold">Why Choose Us</span>
								</div>
								<h2
									className="text-4xl md:text-5xl font-bold mb-6"
									style={{ color: "#EEEEEE" }}
								>
									Learn <span style={{ color: "#00ADB5" }}>Smarter</span>,<br />
									Not Harder
								</h2>
								<p className="text-gray-400 text-lg mb-8">
									Our platform combines video tutorials with an integrated code
									editor for the most effective learning experience.
								</p>
							</motion.div>

							{/* Feature Cards */}
							<div className="space-y-6">
								{features.map((feature, idx) => (
									<motion.div
										key={idx}
										initial={{ opacity: 0, x: -30 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: idx * 0.1 }}
										whileHover={{ x: 10 }}
										className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-sm hover:backdrop-blur-md transition-all"
										style={{
											backgroundColor: "rgba(57, 62, 70, 0.3)",
											border: "1px solid rgba(255, 255, 255, 0.1)",
										}}
									>
										<div
											className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
											style={{ backgroundColor: `${feature.color}20` }}
										>
											<feature.icon
												size={24}
												style={{ color: feature.color }}
											/>
										</div>
										<div>
											<h3
												className="font-bold text-lg mb-1"
												style={{ color: "#EEEEEE" }}
											>
												{feature.title}
											</h3>
											<p className="text-gray-400">{feature.description}</p>
										</div>
									</motion.div>
								))}
							</div>
						</div>

						{/* Interactive Demo Card */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.02 }}
							className="relative"
						>
							<div
								className="rounded-2xl overflow-hidden backdrop-blur-sm"
								style={{
									backgroundColor: "rgba(34, 40, 49, 0.8)",
									border: "1px solid rgba(0, 173, 181, 0.3)",
									boxShadow: "0 20px 60px rgba(0, 173, 181, 0.2)",
								}}
							>
								{/* Mock Code Editor */}
								<div className="p-6" style={{ backgroundColor: "#1E1E1E" }}>
									<div className="flex gap-2 mb-4">
										<div className="w-3 h-3 rounded-full bg-red-500"></div>
										<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
										<div className="w-3 h-3 rounded-full bg-green-500"></div>
									</div>
									<pre className="text-sm" style={{ color: "#D4D4D4" }}>
										<code>
											{`// Real-time Code Editor
function LiveCoding() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  
  const runCode = () => {
    // Execute code instantly
    const output = eval(code);
    setResult(output);
  };

  return (
    <div className="editor">
      <textarea 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      />
      <button onClick={runCode}>
        Run Code
      </button>
      <div className="output">
        {result}
      </div>
    </div>
  );
}`}
										</code>
									</pre>
								</div>

								{/* Video Player Mock */}
								<div className="p-6">
									{/* Video Player */}
									<div className="aspect-video rounded-lg mb-4 overflow-hidden bg-black">
										<iframe
											className="w-full h-full"
											src="https://www.youtube.com/embed/W6NZfCO5SIk?autoplay=0&rel=0&modestbranding=1"
											title="Live Coding Session"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-400">
											{/* Live coding session in progress... */}
										</span>
										{/* <motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className="px-4 py-2 rounded-lg text-sm font-medium"
											style={{
												backgroundColor: "#00ADB5",
												color: "#FFFFFF",
											}}
										>
											Join Session
										</motion.button> */}
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="py-20 relative">
				<div className="container mx-auto px-4 relative z-10">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="max-w-4xl mx-auto text-center rounded-3xl p-12 backdrop-blur-xl"
						style={{
							backgroundColor: "rgba(57, 62, 70, 0.6)",
							border: "1px solid rgba(0, 173, 181, 0.3)",
							boxShadow: "0 30px 60px rgba(0, 173, 181, 0.2)",
						}}
					>
						<motion.div
							animate={{
								rotate: 360,
								scale: [1, 1.1, 1],
							}}
							transition={{
								rotate: { duration: 20, repeat: Infinity, ease: "linear" },
								scale: { duration: 2, repeat: Infinity },
							}}
							className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
							style={{
								backgroundColor: "rgba(0, 173, 181, 0.1)",
								border: "2px solid rgba(0, 173, 181, 0.3)",
							}}
						>
							<Rocket className="text-[#00ADB5]" size={48} />
						</motion.div>

						<h2
							className="text-5xl font-bold mb-6"
							style={{ color: "#EEEEEE" }}
						>
							Ready to Transform Your <br />
							<span style={{ color: "#00ADB5" }}>Coding Journey?</span>
						</h2>

						<p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
							Join thousands of developers who accelerated their careers with
							hands-on, interactive learning.
						</p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="group relative px-10 py-4 rounded-xl font-bold text-lg overflow-hidden"
								style={{
									background:
										"linear-gradient(135deg, #00ADB5 0%, #393E46 100%)",
									color: "#FFFFFF",
								}}
							>
								<span className="relative z-10 flex items-center gap-3">
									<Command size={20} />
									Start Free Trial (No Credit Card)
									<ArrowRight
										size={20}
										className="group-hover:translate-x-2 transition-transform"
									/>
								</span>
								<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-fullroup-hover:translate-x-[100%] transition-transform duration-1000" />
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-10 py-4 rounded-xl font-bold text-lg border-2"
								style={{
									borderColor: "#00ADB5",
									color: "#00ADB5",
								}}
							>
								<span className="flex items-center gap-3">
									<BookOpen size={20} />
									View Learning Paths
								</span>
							</motion.button>
						</div>

						{/* <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-sm mt-8"
            >
              🚀 7-day free trial • Cancel anytime • Access to all courses
            </motion.p> */}
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Home;
