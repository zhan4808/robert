import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function VerigenProjectPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen pt-24 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4 text-center">VeriGen: Agents for Accelerated Chip Design</h1>
        <div className="flex justify-center mb-6">
          <img src="/QwQ1.gif" alt="VeriGen" className="rounded-lg shadow-lg w-full max-h-96 object-cover" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">Integrated RTL design verification tool for testbench generation, script and trace analysis with multi-agent collaboration for accelerated RTL development.</p>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{`# VeriGen\n\n![VeriGen](https://placehold.co/600x200)\n\n**VeriGen** is an integrated RTL design verification tool that accelerates chip design by automating testbench generation, script and trace analysis, and enabling multi-agent collaboration.\n\n## Features\n- Automated testbench generation for RTL designs\n- Script and trace analysis for rapid debugging\n- Multi-agent collaboration for parallel verification\n\n## How it works\nVeriGen leverages AI agents to generate and validate testbenches, analyze simulation traces, and suggest fixes. This reduces manual effort and speeds up the verification cycle.\n\n## Example Usage\n\n\`\`\`python\ndef verify_design(design):\n    # Generate testbench\n    testbench = verigen.generate_testbench(design)\n    # Run simulation\n    result = verigen.simulate(design, testbench)\n    # Analyze trace\n    verigen.analyze_trace(result.trace)\n    return result.passed\n\`\`\`\n\n---\n\n*Built with Python, SystemVerilog, and multi-agent systems.*`}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 