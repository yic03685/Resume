/**
 * Created by yi on 2015/3/21.
 */

import Item from "templates/Item";
import WorkList from "models/WorkList";


Graph.repeat("WorkItem", Item).in("WorkList.items");