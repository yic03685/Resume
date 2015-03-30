/**
 * Created by yi on 2015/3/29.
 */

import Item from "templates/Item";
import ProjectList from "models/ProjectList";

Graph.repeat("ProjectItem", Item).in("ProjectList.items");