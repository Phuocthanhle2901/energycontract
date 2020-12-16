package vn.infodation.intern.group1.mas.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(StatusType.class)
public abstract class StatusType_ {

	public static volatile SetAttribute<StatusType, StatusLog> statusLogs;
	public static volatile SingularAttribute<StatusType, String> statusTitle;
	public static volatile SingularAttribute<StatusType, String> description;
	public static volatile SingularAttribute<StatusType, Long> id;

	public static final String STATUS_LOGS = "statusLogs";
	public static final String STATUS_TITLE = "statusTitle";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";

}

