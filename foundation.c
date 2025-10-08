#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <limits.h> // Required for INT_MAX

// Define a maximum number of buildings the campus can have
#define MAX_BUILDINGS 50

// --- Data Structures ---

// Represents a single building on campus
typedef struct {
    char name[100]; // Name of the building (e.g., "Library")
    int id;         // A unique integer ID for the building
} Building;

// Represents the entire campus map as a graph
typedef struct {
    int adjMatrix[MAX_BUILDINGS][MAX_BUILDINGS];
    int numBuildings;
    Building buildings[MAX_BUILDINGS];
} CampusGraph;


// --- Core Graph Functions ---

void initGraph(CampusGraph* g) {
    g->numBuildings = 0;
    for (int i = 0; i < MAX_BUILDINGS; i++) {
        for (int j = 0; j < MAX_BUILDINGS; j++) {
            g->adjMatrix[i][j] = 0;
        }
    }
}

void addBuilding(CampusGraph* g, const char* name) {
    if (g->numBuildings >= MAX_BUILDINGS) {
        printf("Error: Maximum number of buildings reached.\n");
        return;
    }
    g->buildings[g->numBuildings].id = g->numBuildings;
    strcpy(g->buildings[g->numBuildings].name, name);
    g->numBuildings++;
}

void addEdge(CampusGraph* g, int srcID, int destID, int distance) {
    if (srcID >= g->numBuildings || destID >= g->numBuildings) {
        printf("Error: Invalid building ID provided.\n");
        return;
    }
    g->adjMatrix[srcID][destID] = distance;
    g->adjMatrix[destID][srcID] = distance;
}

void displayGraph(CampusGraph g) {
    printf("--- Campus Map Adjacency Matrix ---\n");
    // ... (rest of function is the same, can be omitted for brevity if needed)
    printf("Buildings: ");
    for (int i = 0; i < g.numBuildings; i++) {
        printf("%d:%-15s ", i, g.buildings[i].name);
    }
    printf("\n\n");

    for (int i = 0; i < g.numBuildings; i++) {
        printf("%-15s | ", g.buildings[i].name);
        for (int j = 0; j < g.numBuildings; j++) {
            printf("%-5d ", g.adjMatrix[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}

// --- Dijkstra's Algorithm Implementation ---

/**
 * @brief Helper function to find the unvisited vertex with the minimum distance.
 * @returns The index of the vertex with the minimum distance.
 */
int minDistance(int distances[], int visited[], int numBuildings) {
    int min = INT_MAX, min_index;

    for (int v = 0; v < numBuildings; v++) {
        if (visited[v] == 0 && distances[v] <= min) {
            min = distances[v];
            min_index = v;
        }
    }
    return min_index;
}

/**
 * @brief Helper function to print the final path from source to destination.
 */
void printPath(int parent[], int j, Building buildings[]) {
    // Base Case: If j is the source, it has no parent
    if (parent[j] == -1) {
        printf("%s", buildings[j].name);
        return;
    }
    
    printPath(parent, parent[j], buildings);
    printf(" -> %s", buildings[j].name);
}

/**
 * @brief The main function that implements Dijkstra's single source shortest path algorithm.
 * @param g The campus graph.
 * @param startID The ID of the starting building.
 * @param endID The ID of the destination building.
 */
void dijkstra(CampusGraph g, int startID, int endID) {
    int distances[MAX_BUILDINGS]; // Stores the shortest distance from start to i
    int visited[MAX_BUILDINGS];   // 1 if vertex i is included in shortest path tree
    int parent[MAX_BUILDINGS];    // Stores the path tree

    // Step 1: Initialize all distances as INFINITE and visited[] as false
    for (int i = 0; i < g.numBuildings; i++) {
        distances[i] = INT_MAX;
        visited[i] = 0;
    }

    // Distance of source vertex from itself is always 0
    distances[startID] = 0;
    parent[startID] = -1; // Source node has no parent

    // Step 2: Find shortest path for all vertices
    for (int count = 0; count < g.numBuildings - 1; count++) {
        // Pick the minimum distance vertex from the set of vertices not yet processed.
        int u = minDistance(distances, visited, g.numBuildings);

        // Mark the picked vertex as visited
        visited[u] = 1;

        // If we've reached the destination, we can stop early (optional optimization)
        if (u == endID) break;

        // Update distance value of the adjacent vertices of the picked vertex.
        for (int v = 0; v < g.numBuildings; v++) {
            // Update v only if it's not visited, there is an edge from u to v,
            // and total weight of path from start to v through u is smaller than current value of distances[v]
            if (!visited[v] && g.adjMatrix[u][v] && distances[u] != INT_MAX &&
                distances[u] + g.adjMatrix[u][v] < distances[v]) {
                parent[v] = u;
                distances[v] = distances[u] + g.adjMatrix[u][v];
            }
        }
    }

    // Step 3: Print the result
    printf("--- Shortest Path Result ---\n");
    if (distances[endID] == INT_MAX) {
        printf("No path found from %s to %s.\n\n", g.buildings[startID].name, g.buildings[endID].name);
    } else {
        printf("Shortest distance from %s to %s is: %d meters\n", g.buildings[startID].name, g.buildings[endID].name, distances[endID]);
        printf("Path: ");
        printPath(parent, endID, g.buildings);
        printf("\n\n");
    }
}


// --- Main Function (Updated for Testing) ---

int main() {
    CampusGraph campus;
    initGraph(&campus);

    addBuilding(&campus, "Tuck Shop"); // ID: 0
    addBuilding(&campus, "Coffee House");     // ID: 1
    addBuilding(&campus, "BTech Block");   // ID: 2
    addBuilding(&campus, "Happiness Hut"); // ID: 3
    addBuilding(&campus, "Ravi Canteen"); // and so on...
    addBuilding(&campus, "Badminton Court");
    addBuilding(&campus, "Civil Block");
    addBuilding(&campus, "Basketball Court");
    addBuilding(&campus, "Santoshanand Library");
    addBuilding(&campus, "Aryabhatta Lab");
    addBuilding(&campus, "Param Lab");
    addBuilding(&campus, "Petroleum Block");
    addBuilding(&campus, "GEU Block");
    addBuilding(&campus, "Mechanical Block");
    addBuilding(&campus, "Quick Bite Cafe");
    addBuilding(&campus, "Chanakya Block");
    addBuilding(&campus, "KP Nautiyal Block");

    
    addEdge(&campus, 0, 1, 10);  // Admin Block <--> Library (50m)
    addEdge(&campus, 0, 2, 118); // Admin Block <--> Cafeteria (100m)
    addEdge(&campus, 1, 2, 60);  // Library <--> Cafeteria (60m)
    addEdge(&campus, 1, 3, 120); // Library <--> Lab Complex (120m)
    addEdge(&campus, 2, 3, 80);  // Cafeteria <--> Lab Complex (80m)
    
    displayGraph(campus);
    
    // --- Run Dijkstra's Algorithm ---
    // Find the shortest path from Admin Block (ID 0) to Lab Complex (ID 3)
    dijkstra(campus, 0, 3);
    
    return 0;
}