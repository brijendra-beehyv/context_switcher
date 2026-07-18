import React, { useEffect, useState } from "react";
import { Text, Box, useInput } from "ink";
import { getAllContexts, getCurrentContext, useContext } from "./kubectl.js";

function App() {
  const [currentContext, setCurrentContext] = useState<string>();
  const [allContexts, setAllContexts] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  async function initialize() {
    const allContexts = await getAllContexts();
    setAllContexts(allContexts);

    if (allContexts.length > 0) {
      const currentContext = await getCurrentContext();
      const selectedIndex = allContexts.indexOf(currentContext);

      setSelectedIndex(selectedIndex);
      setCurrentContext(currentContext);
    }
  }

  useInput(async (input, key) => {
    if (key.escape || input === "q") {
      process.exit(0);
    }

    if (allContexts.length <= 0) {
      return;
    }

    if (key.upArrow) {
      setSelectedIndex(
        (prev) => (prev + allContexts.length - 1) % allContexts.length,
      );
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => (prev + 1) % allContexts.length);
    }

    if (input === " " || key.return) {
      useContext(allContexts[selectedIndex] as string);
      await initialize();
    }
  });

  useEffect(() => {
    initialize();
    return () => {
      process.stdout.write("\x1b[H\x1b[2J");
    };
  }, []);

  return (
    <Box flexDirection="column">
      <Text bold>Select K8s Context (Enter to switch, q to quit):</Text>

      {allContexts.length > 0 ? (
        allContexts.map((context, i) => (
          <Text key={context} inverse={selectedIndex === i}>
            {context === currentContext ? " * " : "   "}
            {context}
          </Text>
        ))
      ) : (
        <Text>No contexts found.</Text>
      )}
    </Box>
  );
}

export default App;
