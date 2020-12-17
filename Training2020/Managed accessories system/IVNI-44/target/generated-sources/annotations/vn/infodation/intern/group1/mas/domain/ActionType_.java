package vn.infodation.intern.group1.mas.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(ActionType.class)
public abstract class ActionType_ {

	public static volatile SingularAttribute<ActionType, String> actionTitle;
	public static volatile SetAttribute<ActionType, ActionLog> actionLogs;
	public static volatile SingularAttribute<ActionType, String> description;
	public static volatile SingularAttribute<ActionType, Long> id;

	public static final String ACTION_TITLE = "actionTitle";
	public static final String ACTION_LOGS = "actionLogs";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";

}

