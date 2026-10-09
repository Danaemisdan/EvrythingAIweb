const fs = require('fs');
let code = fs.readFileSync('src/app/app/page.tsx', 'utf8');

const startMarker = '{/* --- HORIZONTAL SCROLLING GALLERY --- */}';
const endMarker = '<div className="min-h-screen flex flex-col items-center justify-center text-center px-6">';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found");
  process.exit(1);
}

const newGallery = `{/* --- HORIZONTAL SCROLLING GALLERY --- */}
        <div ref={horizontalScrollRef} className="relative h-[400vh] w-full">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            <motion.div 
              style={{ x: \`-\${hProgress * 75}%\` }}
              className="flex w-[400vw] h-full"
            >
              
              {/* PANEL 1: ENGINEERING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">VS Code</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Terminal</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">GitHub</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Software <br/>Engineering.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum doesn't just write snippets. It physically drives your IDE, reads your entire repository, runs local tests, and pushes bug fixes while you sleep.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    {/* Realistic IDE HTML Mockup */}
                    <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col h-[500px] text-sm">
                      <div className="flex bg-[#2d2d2d] items-center px-4 py-2 border-b border-[#3c3c3c]">
                         <div className="flex gap-1.5 mr-4"><div className="w-3 h-3 rounded-full bg-[#ff5f56]" /><div className="w-3 h-3 rounded-full bg-[#ffbd2e]" /><div className="w-3 h-3 rounded-full bg-[#27c93f]" /></div>
                         <div className="text-[#cccccc] text-xs font-mono">auth.ts — momentum-core</div>
                      </div>
                      <div className="flex flex-1 overflow-hidden">
                        <div className="w-12 bg-[#1e1e1e] flex flex-col items-center py-4 gap-4 border-r border-[#3c3c3c]">
                           <div className="w-6 h-6 bg-zinc-700/50 rounded" />
                           <div className="w-6 h-6 bg-zinc-700/50 rounded" />
                        </div>
                        <div className="flex-1 p-4 font-mono text-[#d4d4d4] flex flex-col relative">
                           <div><span className="text-[#569cd6]">import</span> {'{'} <span className="text-[#9cdcfe]">createHash</span> {'}'} <span className="text-[#569cd6]">from</span> <span className="text-[#ce9178]">'crypto'</span>;</div>
                           <div className="mt-2"><span className="text-[#569cd6]">export async function</span> <span className="text-[#dcdcaa]">verifyToken</span>(token: <span className="text-[#4ec9b0]">string</span>) {'{'}</div>
                           <div className="ml-4"><span className="text-[#569cd6]">const</span> decoded = <span className="text-[#569cd6]">await</span> <span className="text-[#dcdcaa]">jwt_decode</span>(token);</div>
                           <AnimatePresence>
                             {animationStep === 1 && (
                               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4 text-[#f14c4c] bg-[#f14c4c]/10 px-1 inline-block">
                                 // TypeError: jwt_decode is not a function
                               </motion.div>
                             )}
                             {animationStep === 2 && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-4 text-[#4fc1ff] bg-[#4fc1ff]/10 px-1 inline-block">
                                 <span className="text-[#569cd6]">const</span> decoded = <span className="text-[#569cd6]">await</span> <span className="text-[#4ec9b0]">jwt</span>.<span className="text-[#dcdcaa]">verify</span>(token, <span className="text-[#4fc1ff]">process.env.SECRET</span>);
                               </motion.div>
                             )}
                           </AnimatePresence>
                           <div>{'}'}</div>
                           <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#1e1e1e] border-t border-[#3c3c3c] p-3 overflow-hidden flex flex-col justify-end">
                              <div className="text-[#cccccc]">~/projects/momentum-core <span className="text-[#27c93f]">main</span></div>
                              {animationStep >= 1 && <div className="text-[#f14c4c]">$ npm run test <br/>✖ 1 failing (TypeError)</div>}
                              {animationStep === 2 && <div className="text-[#27c93f]">$ momentum fix <br/>Applying patch to auth.ts... <br/>✔ 1 passing. Pushing to origin/main.</div>}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 2: CAD & 3D */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">AutoCAD</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">SolidWorks</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Blender</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Automobile & <br/>3D Designing.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">From simple meshes to complete automobile designing. Momentum physically clicks through complex CAD menus, adjusting dimensions, constraints, and rendering physics simulations completely autonomously.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    {/* Realistic CAD HTML Mockup */}
                    <div className="w-full bg-[#2a2a2a] rounded-xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col h-[500px] text-xs text-zinc-300">
                       <div className="h-8 bg-[#333] border-b border-zinc-700 flex items-center px-4 gap-4">
                          <div className="font-medium text-white">SolidDesign Pro 2026</div>
                          <div className="flex gap-3 text-zinc-400"><span>File</span><span>Edit</span><span>Sketch</span><span>Features</span><span>Evaluate</span></div>
                       </div>
                       <div className="flex-1 flex overflow-hidden">
                          {/* Sidebar */}
                          <div className="w-48 bg-[#333] border-r border-zinc-700 p-2 flex flex-col gap-2 overflow-y-auto">
                             <div className="font-medium text-zinc-200 mb-2">FeatureManager</div>
                             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-500 rounded-sm" /> Chassis_Assembly</div>
                             <div className="flex items-center gap-2 ml-4 text-blue-400"><div className="w-3 h-3 bg-blue-500 rounded-full" /> V8_Engine_Block</div>
                             <div className="flex items-center gap-2 ml-4"><div className="w-3 h-3 bg-zinc-500 rounded-sm" /> Suspension_Front</div>
                             <div className="flex items-center gap-2 ml-4"><div className="w-3 h-3 bg-zinc-500 rounded-sm" /> Axle_Rear</div>
                          </div>
                          {/* Canvas */}
                          <div className="flex-1 bg-[#1c1c1c] relative flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                             {/* Fake 3D Car Wireframe */}
                             <motion.div animate={{ rotateY: animationStep === 2 ? 180 : 0, scale: animationStep === 1 ? 1.1 : 1 }} transition={{ duration: 4, ease: "easeInOut" }} className="w-64 h-32 border border-blue-500/50 rounded-3xl flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                                <div className="absolute inset-x-8 -bottom-4 h-8 flex justify-between">
                                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-[#1c1c1c]" />
                                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-[#1c1c1c]" />
                                </div>
                                <div className="absolute top-0 left-1/4 right-1/4 h-1/2 border-t border-x border-blue-500/50 rounded-t-xl" />
                             </motion.div>
                             
                             {/* Floating Context Menu applied by Momentum */}
                             <AnimatePresence>
                               {animationStep >= 1 && (
                                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-1/4 right-10 bg-[#333] border border-blue-500 rounded shadow-xl p-3 w-40 z-10">
                                     <div className="font-medium text-white mb-2 border-b border-zinc-600 pb-1">Fillet / Chamfer</div>
                                     <div className="flex justify-between items-center mb-1"><span>Radius:</span> <span className="bg-black px-1 text-emerald-400 border border-emerald-500/30">15.0mm</span></div>
                                     <div className="flex justify-between items-center text-zinc-500"><span>Edges:</span> <span>4 selected</span></div>
                                  </motion.div>
                               )}
                             </AnimatePresence>
                             
                             {/* Cursor */}
                             <motion.div 
                                animate={{ x: animationStep === 0 ? -100 : animationStep === 1 ? 80 : -50, y: animationStep === 0 ? 50 : -60 }}
                                transition={{ type: "spring" }}
                                className="absolute w-4 h-4 z-20 pointer-events-none drop-shadow-2xl"
                             >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 3.75L18.75 11.25L11.25 12.75L9 20.25L4.5 3.75Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                             </motion.div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: COMMUNICATIONS */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Slack</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">iMessage</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Superhuman</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Everyday <br/>Communications.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Messaging people everyday, completely handled. Momentum reads context across platforms and physically drafts nuanced replies to your team in Slack, or negotiates deals in your email.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    {/* Realistic Slack/iMessage Split Mockup */}
                    <div className="w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex h-[500px] text-sm text-zinc-200">
                      {/* Slack Side */}
                      <div className="flex-1 border-r border-zinc-800 flex flex-col bg-[#1a1d21]">
                         <div className="h-12 border-b border-zinc-800 flex items-center px-4 font-bold text-white"># product-updates</div>
                         <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative">
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded bg-pink-600 flex-shrink-0" />
                               <div>
                                 <div className="font-bold text-white text-sm">Sarah <span className="text-zinc-500 font-normal text-xs ml-1">11:05 AM</span></div>
                                 <div className="text-zinc-300 mt-1">Can someone update me on the Q3 roadmap for the mobile app? I have a client meeting in 10.</div>
                               </div>
                            </div>
                            <AnimatePresence>
                              {animationStep >= 1 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-2">
                                   <div className="w-8 h-8 rounded bg-purple-600 flex-shrink-0" />
                                   <div>
                                     <div className="font-bold text-white text-sm">You <span className="text-zinc-500 font-normal text-xs ml-1">11:06 AM</span> <span className="text-[10px] text-purple-400 border border-purple-500/30 px-1 rounded ml-1">Momentum Draft</span></div>
                                     <div className="text-zinc-300 mt-1">Hey Sarah, mobile V2 is launching Sept 15th. We're prioritizing the new dashboard and biometric login. I've attached the one-pager you can show the client!</div>
                                   </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                      </div>
                      {/* iMessage Side */}
                      <div className="w-[40%] flex flex-col bg-black">
                         <div className="h-12 border-b border-zinc-800 flex items-center justify-center font-bold text-white text-xs">Mike (Co-founder)</div>
                         <div className="flex-1 p-4 flex flex-col gap-3 justify-end overflow-hidden">
                            <div className="bg-zinc-800 p-2.5 rounded-2xl rounded-bl-sm self-start max-w-[85%] text-xs">
                               Dude, did we send the wire transfer to the agency yet?
                            </div>
                            <AnimatePresence>
                              {animationStep === 2 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9, originY: 1 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-600 text-white p-2.5 rounded-2xl rounded-br-sm self-end max-w-[85%] text-xs border border-blue-500">
                                   Yeah, just sent it 5 mins ago. Should clear by tomorrow.
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <div className="h-8 border border-zinc-700 rounded-full mt-2 flex items-center px-3 text-zinc-500 text-xs">iMessage</div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 4: UNIVERSAL */}
              <div className="w-[100vw] h-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                <div className="relative z-10 max-w-4xl flex flex-col items-center text-center mt-[10vh]">
                  <div className="flex gap-2 mb-6">
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">macOS</span>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Windows</span>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Linux</span>
                  </div>
                  <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 text-white drop-shadow-xl">Total privacy.<br/>Zero APIs.</h3>
                  <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed drop-shadow-md mb-8">How does it do all this? Momentum hooks into native OS accessibility layers to control literally any application on your screen. Blisteringly fast. 100% local execution. Best of all? It's a one-time fee of $30. We despise subscriptions.</p>
                </div>
                {/* Fake Desktop HTML Mockup directly below the text */}
                <div className="w-full max-w-4xl h-[400px] mt-8 bg-black rounded-t-2xl border-t border-x border-zinc-800 shadow-[0_0_100px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden relative">
                   <div className="h-6 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between text-zinc-500 text-xs">
                     <div>Apple</div>
                     <div className="flex gap-4"><span>File</span><span>Edit</span><span>View</span></div>
                     <div>Mon 9:41 AM</div>
                   </div>
                   <div className="flex-1 relative overflow-hidden bg-zinc-950">
                      {/* Fake Windows */}
                      <motion.div animate={{ scale: animationStep === 2 ? 1.05 : 1 }} className="absolute top-10 left-10 w-[60%] h-[200px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                         <div className="h-6 bg-zinc-800 border-b border-zinc-700 px-2 flex items-center text-[10px] text-zinc-400">Blender - engine.blend</div>
                         <div className="flex-1 flex items-center justify-center border-2 border-dashed border-purple-500/30 m-4 rounded relative">
                            {animationStep > 0 && <div className="absolute inset-0 bg-purple-500/10" />}
                         </div>
                      </motion.div>
                      <motion.div animate={{ scale: animationStep === 1 ? 1.05 : 1 }} className="absolute bottom-10 right-10 w-[50%] h-[180px] bg-black border border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs font-mono">
                         <div className="h-6 bg-zinc-900 border-b border-zinc-800 px-2 flex items-center text-[10px] text-zinc-400">Terminal</div>
                         <div className="p-3 text-emerald-400">
                           $ momentum system inject<br/>
                           <span className="text-zinc-500">Hooking OS accessibility APIs...</span><br/>
                           <span className="text-purple-400">Control granted.</span>
                         </div>
                      </motion.div>
                   </div>
                   {/* Fake Cursor controlled by Momentum */}
                   <motion.div 
                      animate={{ 
                        x: animationStep === 0 ? "35vw" : animationStep === 1 ? "10vw" : "20vw",
                        y: animationStep === 0 ? "5vh" : animationStep === 1 ? "-10vh" : "-15vh"
                      }}
                      transition={{ type: "spring", stiffness: 40, damping: 25 }}
                      className="absolute w-5 h-5 z-20 pointer-events-none drop-shadow-2xl"
                      style={{ left: "50%", top: "50%" }}
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M4.5 3.75L18.75 11.25L11.25 12.75L9 20.25L4.5 3.75Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                     </svg>
                   </motion.div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

        `;

const patchedCode = code.slice(0, startIndex) + newGallery + '\n        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">' + code.slice(endIndex + endMarker.length);
fs.writeFileSync('src/app/app/page.tsx', patchedCode);
